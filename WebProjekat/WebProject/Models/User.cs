using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using WebProject.Database.Mapper;

namespace WebProject.Models
{
    public class User
    {
        [PrimaryKey]
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public Gender Gender { get; set; }
        public string JMBG { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
        [JsonField]
        protected Location Location { get; set; }
        [ForeignField("vehicle", "id")]
        protected Vehicle Vehicle { get; set; }

        public User()
        {

        }

        public void MaskPassword()
        {
            Password = GetMaskedPassword();
        }

        public string GetMaskedPassword()
        {
            int passlen = Password.Length;
            string result = "";
            for (int i = 0; i < passlen; i++) result += "*";

            return result;
        }

        protected User(User user)
        {
            Id = user.Id;
            Username = user.Username;
            Password = user.Password;
            Firstname = user.Firstname;
            Lastname = user.Lastname;
            Gender = user.Gender;
            JMBG = user.JMBG;
            PhoneNumber = user.PhoneNumber;
            Email = user.Email;
            Role = user.Role;
            Location = user.Location;
            Vehicle = user.Vehicle;
        }

        public bool Validate()
        {
            return ValidateUsername(Username) && ValidatePassword(Password) && ValidateName(Firstname) && ValidateName(Lastname) && ValidatePhone(PhoneNumber) && ValidateJMBG(JMBG) && ValidateEmail(Email);
        }

        private string RemoveWhiteSpace(string str)
        {
            return Regex.Replace(str, @"\s+", "");
        }

        public bool ValidateUsername(string username)
        {
            return username.Equals(RemoveWhiteSpace(username)) && username.Length > 0;
        }

        public bool ValidatePassword(string password)
        {
            return password.Length > 0;
        }

        public bool ValidateName(string name)
        {
            return RemoveWhiteSpace(name).Length > 0;
        }

        public bool ValidateEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ValidatePhone(string phone)
        {
            return true;
        }

        public bool ValidateJMBG(string jmbg)
        {
            return jmbg.Length == 13;
        }

        public User GetFromRole()
        {
            switch(Role)
            {
                case Role.Customer:
                    return new Customer(this);
                case Role.Dispatcher:
                    return new Dispatcher(this);
                case Role.Driver:
                    return new Driver(this);
            }

            return this;
        }
    }
}