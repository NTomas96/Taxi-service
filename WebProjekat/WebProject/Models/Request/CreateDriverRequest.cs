using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class CreateDriverRequest
    {
        public uint Token { get; set; }
        public Driver Driver { get; set; }
    }
}