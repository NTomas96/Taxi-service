using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SQLite;
using System.IO;

namespace Projekat.DataBaseFolder
{
    public class DataBase
    {
        private SQLiteConnection database;

        public DataBase ()
        {
            Console.WriteLine(AppDomain.CurrentDomain.BaseDirectory);

            if (!File.Exists("db.db"))
            {
                SQLiteConnection.CreateFile("db.db");
            }

            database = new SQLiteConnection("Data Source=db.db;Version=3;");
            database.Open();

            string query = "";

            SQLiteCommand command = new SQLiteCommand(query, database);
            command.ExecuteNonQuery();
        }
    }
}