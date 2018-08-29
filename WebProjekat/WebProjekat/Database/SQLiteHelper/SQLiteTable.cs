using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProjekat.Database.SQLiteHelper
{
    public class SQLiteTable
    {
        public string TableName = "";
        public SQLiteColumnList Columns = new SQLiteColumnList();

        public SQLiteTable()
        { }

        public SQLiteTable(string name)
        {
            TableName = name;
        }
    }
}