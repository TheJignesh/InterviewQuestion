using ContactManagement.Models;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ContactManagement.Controllers
{
    public class ContactManagementController : Controller
    {
        private DemoEntities db = new DemoEntities();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddNewContact()
        {
            return View();
        }
        public JsonResult SaveAdminSetting(Contact contactData)
        {
            try
            {
                db.Contacts.Add(contactData);
                return new JsonResult
                {
                    Data = new { Message = "Data added Successfully", Success = true }
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { Message = ex.Message.ToString(), Success = false }
                };
            }
            
        }
        public JsonResult GetContactList()
        {
            try
            {
                //db.Contacts.Add(contactData);
                List<Contact> contactList = db.Contacts.ToList();
                return new JsonResult
                {
                    Data = new { Message = "", Success = true, contactList }
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { Message = ex.Message.ToString(), Success = false }
                };
            }
        }
        public JsonResult UpdateFavouriteStatus(int Id, bool IsFavourite)
        {
            try
            {
                var paraId = new SqlParameter("@Id", Id);
                var paraIsFavourite = new SqlParameter("@Status", IsFavourite);
                
                db.Database.ExecuteSqlCommand("exec spAddToFavourite @Id, @Status", paraId, paraIsFavourite);
                return new JsonResult
                {
                    Data = new { Message = "", Success = true }
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { Message = ex.Message.ToString(), Success = false }
                };
            }
        }
    }
}