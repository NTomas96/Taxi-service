﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebProject.Database;
using WebProject.Models;

namespace WebProject.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View("Home");
        }
    }
}
