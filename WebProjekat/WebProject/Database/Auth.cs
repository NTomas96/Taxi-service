using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebProject.Models;

namespace WebProject.Database
{
    public class Auth
    {
        private Database database;

        public Auth(Database database)
        {
            this.database = database;
        }

        public User GetUserByUsername(string username)
        {
            User user = database.SelectOne<User>("SELECT * FROM user WHERE Username = @username", new Dictionary<string, object>() { { "@username", username }});

            if (user == null) return null;

            return user.GetFromRole();
        }

        public User GetUserByUsernameAndPassword(string username, string password)
        {
            User user = database.SelectOne<User>("SELECT * FROM user WHERE Username = @username AND Password = @password", new Dictionary<string, object>() { { "@username", username }, { "@password", password } });

            if (user == null) return null;

            return user.GetFromRole();
        }

        public User GetUserById(long Id)
        {
            User user = database.SelectOne<User>("SELECT * FROM user WHERE Id = @id", new Dictionary<string, object>() { { "@id", Id } });

            if (user == null) return null;

            return user.GetFromRole();
        }

        public bool RegisterUser(User user)
        {
            try
            {
                return database.Insert<User>("user", user) > 0;
            }
            catch(Exception e)
            {
                return false;
            }
        }

        public bool UpdateUser(User user)
        {
            try
            {
                return database.Update<User>("user", user) > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool RegisterDriver(Driver driver)
        {
            try
            {
                return database.Insert<Driver>("user", driver) > 0;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public List<User> GetAllUsers()
        {
            return database.Select<User>("SELECT * FROM user WHERE Role != 1", new Dictionary<string, object>() { });
        }
        
    }
}