using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class EditProfileRequest
    {
        public User User { get; set; }
        public uint Token { get; set; }
    }
}