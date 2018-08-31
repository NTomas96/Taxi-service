using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using WebProject.Database;
using WebProject.Models;
using WebProject.Models.Request;
using WebProject.Models.Response;
using WebProject.Providers;

namespace WebProject.Controllers
{
    public class AccountController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Home([FromUri] HomeRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if(session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            HomeResponse response = new HomeResponse();
            response.User = auth.GetUserById(((User) session["user"]).Id);
            session["user"] = response.User; //update user from db
            response.User.MaskPassword();
            response.Code = 0;

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Edit([FromBody] EditProfileRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            EditProfileResponse response = new EditProfileResponse();

            var user = auth.GetUserById(((User)session["user"]).Id);
            
            if(! user.GetMaskedPassword().Equals(request.User.Password))
            {
                user.Password = request.User.Password;
            }

            user.Firstname = request.User.Firstname;
            user.Lastname = request.User.Lastname;
            user.Gender = request.User.Gender;
            user.JMBG = request.User.JMBG;
            user.PhoneNumber = request.User.PhoneNumber;
            user.Email = request.User.Email;

            if(user.Validate())
            {
                if (auth.UpdateUser(user))
                {
                    response.Code = 0;
                }
                else
                {
                    response.Code = 3;
                    response.Error = "Unknown error!";
                }
            }
            else
            {
                response.Code = 2;
                response.Error = "Invalid user info!";
            }

            

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult EditLocation([FromBody] EditLocationRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            EditProfileResponse response = new EditProfileResponse();

            var user = auth.GetUserById(((User) session["user"]).Id);

            if (user.Role == Role.Driver)
            {
                ((Driver) user).Location = request.Location;

                if (auth.UpdateUser(user))
                {
                    response.Code = 0;
                }
                else
                {
                    response.Code = 2;
                    response.Error = "Unknown error!";
                }
            }
            else
            {
                return Json(new NoAccessResponse());
            }

            return Json(response);
        }
    }
}
