using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace WebProject
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/common.js",
                "~/Scripts/app/start.js",

                "~/Scripts/app/cancelride.js",
                "~/Scripts/app/createdriver.js",
                "~/Scripts/app/createride.js",
                "~/Scripts/app/commentride.js",
                "~/Scripts/app/giveride.js",
                "~/Scripts/app/editlocation.js",
                "~/Scripts/app/editprofile.js",
                "~/Scripts/app/editride.js",
                "~/Scripts/app/finishride.js",
                "~/Scripts/app/home.js",
                "~/Scripts/app/login.js",
                "~/Scripts/app/orderride.js",
                "~/Scripts/app/register.js",
                "~/Scripts/app/script.js",
                "~/Scripts/app/blockUser.js"
                ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Content/bootstrap.css",
                 "~/Content/Site.css"));
        }
    }
}
