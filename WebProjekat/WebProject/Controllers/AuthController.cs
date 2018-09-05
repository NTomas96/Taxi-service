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
    public class AuthController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Login([FromBody] LoginRequest request)
        {
            LoginResponse response = new LoginResponse();

            Auth auth = new Auth(Database.Database.GetInstance());

            User user = auth.GetUserByUsernameAndPassword(request.Username, request.Password);

            if (user != null)
            {
                uint sessionId = SessionProvider.GetInstance().CreateNewSession();
                var session = SessionProvider.GetInstance().GetSession(sessionId);

                if (!user.Blocked)
                {
                    response.Code = 0;
                    response.Token = sessionId;

                    session["user"] = user;
                }
                else
                {
                    response.Code = 2;
                    response.Error = "This username has been blocked by admin!\nPlease try again later.";
                }
            }
            else
            {
                response.Code = 2;
                response.Error = "Invalid username or password";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Register([FromBody] RegisterRequest request)
        {
            RegisterResponse response = new RegisterResponse();
            

            Auth auth = new Auth(Database.Database.GetInstance());

            request.User.Role = Role.Customer;

            if(request.User.Validate())
            {
                if(auth.GetUserByUsername(request.User.Username) == null)
                {
                    if(auth.RegisterUser(request.User))
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
                    response.Code = 3;
                    response.Error = "User already exists!";
                }
            }
            else
            {
                response.Code = 4;
                response.Error = "Invalid user info!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult CreateDriver([FromBody] CreateDriverRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());

            session["user"] = auth.GetUserById(((User) session["user"]).Id); //update user from db

            if(((User) session["user"]).Role != Role.Dispatcher)
            {
                return Json(new NoAccessResponse());
            }

            RegisterResponse response = new RegisterResponse();
            request.Driver.Role = Role.Driver;

            if (request.Driver.Validate())
            {
                if (auth.GetUserByUsername(request.Driver.Username) == null)
                {
                    if (auth.RegisterDriver(request.Driver))
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
                    response.Code = 3;
                    response.Error = "User already exists!";
                }
            }
            else
            {
                response.Code = 4;
                response.Error = "Invalid user info!";
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult Logout([FromBody] LogoutRequest request)
        {
            LogoutResponse response = new LogoutResponse();

            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if(session != null)
            {
                SessionProvider.GetInstance().DeleteSession(request.Token);
            }

            return Json(response);
        }

        [HttpPost]
        public IHttpActionResult blockOrUnblockUser([FromBody] BlockOrUnblockRequest request)
        {
            Response response = new Response();

            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            Auth auth = new Auth(Database.Database.GetInstance());
            session["user"] = auth.GetUserById(((User)session["user"]).Id); //update user from db

            if (!(session["user"] is Dispatcher))
            {
                return Json(new NoAccessResponse());
            }

            User u = auth.GetUserById(request.UserId);
            u.Blocked = !u.Blocked;

            if(auth.UpdateUser(u))
            {
                response.Code = 0;
            }
            else
            {
                response.Code = 2;
                response.Error = "User can't be blocked of unblocked";
            }

            return Json(response);
        }

        [HttpGet]
        public IHttpActionResult GetAllUsers([FromUri] GetAllUsersRequest request)
        {
            var session = SessionProvider.GetInstance().GetSession(request.Token);

            if (session == null)
            {
                return Json(new NoAccessResponse());
            }

            if (((User)session["user"]).Role != Role.Dispatcher)
            {
                return Json(new NoAccessResponse());
            }
            
            Auth users = new Auth(Database.Database.GetInstance());

            GetAllUsersResponse response = new GetAllUsersResponse();
            response.Users = users.GetAllUsers();

            return Json(response);
        }
    }
}
