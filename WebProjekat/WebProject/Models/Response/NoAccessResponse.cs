using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Response
{
    public class NoAccessResponse : Response
    {

        public NoAccessResponse() : base()
        {
            Error = "You don't have access to this page!";
            Code = 1;
        }
    }
}