using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using WebProject.Database;
using WebProject.Models;

namespace WebProject
{
    public class Admins
    {
        public static void Load(string fileName)
        {
            try
            {
                string text = File.ReadAllText(fileName);

                List<User> users = JsonConvert.DeserializeObject<List<User>>(text);

                foreach(User user in users)
                {
                    user.Role = Role.Dispatcher;

                    Auth auth = new Auth(Database.Database.GetInstance());

                    try
                    {
                        auth.RegisterUser(user);
                    }
                    catch { }
                    
                }
            }
            catch{ }
        }
    }
}