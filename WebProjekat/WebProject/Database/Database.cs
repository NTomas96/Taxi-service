using System;
using System.Collections.Generic;
using System.IO;
using System.Data.SQLite.Linq;
using System.Linq;
using System.Web;
using System.Data.SQLite;
using System.Reflection;
using WebProject.Database.Mapper;
using System.Data;
using Newtonsoft.Json;

namespace WebProject.Database
{
    public class Database
    {
        private static Database instance;

        public static Database GetInstance()
        {
            if(instance == null)
            {
                instance = new Database();
            }

            return instance;
        }

        private SQLiteConnection database;

        public Database()
        {
            if (!File.Exists("db.db"))
            {
                SQLiteConnection.CreateFile("db.db");
            }

            database = new SQLiteConnection("Data Source=db.db;Version=3;");
            database.Open();

            string[] tables = {
                "CREATE TABLE IF NOT EXISTS `user` (`Id` INTEGER PRIMARY KEY AUTOINCREMENT,`Username` TEXT UNIQUE,`Password` TEXT,`Firstname` TEXT, `Lastname` TEXT,`JMBG` TEXT,`PhoneNumber` TEXT,`Email` TEXT,`Gender` INTEGER,`Role` INTEGER, `Location` TEXT, `Vehicle` INTEGER);",
                "CREATE TABLE IF NOT EXISTS `vehicle` (`Id` INTEGER PRIMARY KEY AUTOINCREMENT, `Year` INTEGER, `License` TEXT, `TaxiID` TEXT, `Type` INTEGER);",
                "CREATE TABLE IF NOT EXISTS `ride` (`Id` INTEGER PRIMARY KEY AUTOINCREMENT, `Time` INTEGER, `Origin` TEXT, `VehicleType` INTEGER, `Customer` INTEGER, `Destination` TEXT, `Dispatcher` INTEGER, `Driver` INTEGER, `Price` REAL, `Status` INTEGER, `Comment` TEXT);"
            };

            foreach (string query in tables)
            {
                SQLiteCommand command = new SQLiteCommand(query, database);
                command.ExecuteNonQuery();
            }
        }

        public T SelectOne<T>(string sql, Dictionary<string, object> parms) where T : class, new()
        {
            List<T> all = Select<T>(sql, parms);

            if (all.Count > 0)
                return all[0];

            return default(T); // null
        }

        public List<T> Select<T>(string sql, Dictionary<string, object> parms) where T : class, new()
        {
            List<T> result = new List<T>();

            SQLiteCommand cmd = new SQLiteCommand(database);
            SQLiteHelper helper = new SQLiteHelper(cmd);
            DataTable table = helper.Select(sql, parms);


            foreach(DataRow row in table.Rows)
            {
                T obj = new T();

                foreach (PropertyInfo prop in obj.GetType().GetProperties(BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance))
                {
                    string name = prop.Name;

                    Attribute jsonField = prop.GetCustomAttribute(typeof(JsonField));
                    ForeignField foreignField = (ForeignField)prop.GetCustomAttribute(typeof(ForeignField));

                    try
                    {
                        object value = row[name];

                        if (row.IsNull(name)) value = null;

                        if(jsonField != null)
                        {
                            if(value is string)
                            {
                                //value = JsonConvert.DeserializeObject((string) value);

                                //MethodInfo openGenericMethod = typeof(JsonConvert).GetMethod("DeserializeObject",  new[] { typeof(string) });
                                MethodInfo openGenericMethod = typeof(JsonConvert).GetMethods().Single(m =>
                                    m.Name == "DeserializeObject" &&
                                    m.GetGenericArguments().Length == 1 &&
                                    m.GetParameters().Length == 1 &&
                                    m.GetParameters()[0].ParameterType == typeof(string));

                                MethodInfo closedGenericMethod = openGenericMethod.MakeGenericMethod(prop.PropertyType);
                                value = closedGenericMethod.Invoke(this, new object[] { (string) value });
                            }
                            else
                            {
                                continue; // skip json field if it's not a string in the database
                            }
                        }

                        if(foreignField != null)
                        {
                            if(value != null)
                            {
                                MethodInfo openGenericMethod = typeof(Database).GetMethod("SelectOne");
                                MethodInfo closedGenericMethod = openGenericMethod.MakeGenericMethod(prop.PropertyType);

                                string sqlQuery = "SELECT * FROM `" + foreignField.TableName + "` WHERE `" + foreignField.IdFieldName + "` = @value";
                                Dictionary<string, object> queryParms = new Dictionary<string, object>() { { "@value", value } };

                                value = closedGenericMethod.Invoke(this, new object[] { sqlQuery, queryParms });
                            }
                        }

                        Type propertyType = prop.PropertyType;

                        if (Nullable.GetUnderlyingType(propertyType) != null)
                        {
                            propertyType = Nullable.GetUnderlyingType(propertyType);
                        }

                        if (propertyType.IsEnum)
                        {
                            value = Enum.ToObject(propertyType, value);
                        }
                        else
                        {
                            var targetType = (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition().Equals(typeof(Nullable<>))) ? Nullable.GetUnderlyingType(propertyType) : propertyType;
                            value = Convert.ChangeType(value, targetType);
                        }
                        
                        prop.SetValue(obj, value);
                    }
                    catch(Exception e)
                    {
                        continue;
                    }
                }

                result.Add(obj);
            }

            return result;
        }

        public int Insert<T>(string tableName, T obj)
        {
            return Insert<T>(tableName, obj, null);
        }

        public int Insert<T> (string tableName, T obj, SQLiteTransaction transaction)
        {
            Dictionary<string, object> fields = new Dictionary<string, object>();

            Type type = obj.GetType();

            if(transaction == null)
            {
                //transaction = database.BeginTransaction();
            }

            foreach(PropertyInfo prop in type.GetProperties())
            {
                Attribute primaryKey = prop.GetCustomAttribute(typeof(PrimaryKey));
                Attribute jsonField = prop.GetCustomAttribute(typeof(JsonField));
                ForeignField foreignField = (ForeignField) prop.GetCustomAttribute(typeof(ForeignField));

                if (primaryKey != null)
                    continue; // dont add primary key

                string name = prop.Name;
                object value = prop.GetValue(obj);

                if(jsonField != null)
                {
                    value = JsonConvert.SerializeObject(value);
                }

                if(foreignField != null)
                {
                    if(value != null)
                    {
                        Type objType = value.GetType();

                        PropertyInfo idprop = objType.GetProperty(foreignField.IdFieldName);
                        object id = idprop.GetValue(value);

                        if (id == null || ((long) id) == 0)
                        {
                            MethodInfo openGenericMethod = typeof(Database).GetMethods().Single(m =>
                                    m.Name == "Insert" &&
                                    m.GetGenericArguments().Length == 1 &&
                                    m.GetParameters().Length == 3);

                            //MethodInfo openGenericMethod = typeof(Database).GetMethod("Insert");
                            MethodInfo closedGenericMethod = openGenericMethod.MakeGenericMethod(objType);
                            int result = (int) closedGenericMethod.Invoke(this, new object[] { foreignField.TableName, value, transaction });

                            if (result > 0)
                            {
                                value = database.LastInsertRowId;
                            }
                            else
                            {
                                value = null;
                            }
                        }
                        else
                        {
                            value = id;
                        }
                    }
                }

                fields.Add(name, value);
            }

            SQLiteCommand cmd = new SQLiteCommand(database);
            //cmd.Transaction = transaction;
            SQLiteHelper helper = new SQLiteHelper(cmd);

            helper.Insert(tableName, fields);

            //transaction.Commit();
            return 1;
        }

        public int Update<T>(string tableName, T obj)
        {
            Dictionary<string, object> fields = new Dictionary<string, object>();

            Type type = obj.GetType();

            string keyName = null;
            object keyValue = null;

            foreach (PropertyInfo prop in type.GetProperties())
            {
                Attribute primaryKey = prop.GetCustomAttribute(typeof(PrimaryKey));
                Attribute jsonField = prop.GetCustomAttribute(typeof(JsonField));
                ForeignField foreignField = (ForeignField) prop.GetCustomAttribute(typeof(ForeignField));

                string name = prop.Name;
                object value = prop.GetValue(obj);

                if (primaryKey != null)
                {
                    keyName = name;
                    keyValue = value;

                    continue;
                }

                if (jsonField != null)
                {
                    value = JsonConvert.SerializeObject(value);
                }

                if (foreignField != null)
                {
                    if (value != null)
                    {
                        Type objType = value.GetType();
                        MethodInfo openGenericMethod = typeof(Database).GetMethod("Update");
                        MethodInfo closedGenericMethod = openGenericMethod.MakeGenericMethod(objType);
                        int result = (int) closedGenericMethod.Invoke(this, new object[] { foreignField.TableName, value });

                        if (result > 0)
                        {
                            var key = objType.GetProperty(foreignField.IdFieldName);
                            value = key.GetValue(value);
                        }
                        else
                        {
                            value = null;
                        }
                    }
                }

                fields.Add(name, value);
            }

            if(keyName == null)
            {
                return 0;
            }

            SQLiteCommand cmd = new SQLiteCommand(database);
            SQLiteHelper helper = new SQLiteHelper(cmd);

            Dictionary<string, object> cond = new Dictionary<string, object>();
            cond.Add(keyName, keyValue);

            return helper.Update(tableName, fields, cond);
        }
    }
}