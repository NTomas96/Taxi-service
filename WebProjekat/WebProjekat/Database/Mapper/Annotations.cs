using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProjekat.Database.Mapper
{
    public class PrimaryKey : Attribute
    {

    }

    public class JsonField : Attribute
    {

    }

    public class ForeignField : Attribute
    {
        public string TableName { get; set; }
        public string IdFieldName { get; set; }

        public ForeignField(string tableName, string idFieldName)
        {
            TableName = tableName;
            IdFieldName = idFieldName;
        }
    }
}