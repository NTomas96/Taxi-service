using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class BlockOrUnblockRequest
    {
        public uint Token { get; set; }
        public long UserId { get; set; }
    }
}