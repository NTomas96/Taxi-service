using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models
{
    public class Customer : User
    {
        public Customer(User user) : base(user)
        {
            Location = null;
            Vehicle = null;
        }

        public Customer()
        {

        }
    }
}