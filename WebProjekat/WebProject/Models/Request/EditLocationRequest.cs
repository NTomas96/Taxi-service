using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class EditLocationRequest
    {
        public Location Location { get; set; }
        public uint Token { get; set; }
    }
}