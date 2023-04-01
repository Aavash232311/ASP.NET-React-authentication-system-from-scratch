using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Engineer.Decorators
{
    public class CSRFAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // The idea is to compare token from cookie and http header
            bool res = false;
            string? csrfTokenHeader = context.HttpContext.Request.Headers["X-XSRF-TOKEN"];
            var cookies =  context.HttpContext.Request.Cookies;
            string csrfFromCookie = string.Empty;
            foreach (var i in cookies){
                if (i.Key == "XSRF-TOKEN")
                {
                    csrfFromCookie = i.Value.Trim();
                }
            }
            if (csrfFromCookie == csrfTokenHeader)
            {
                res = true;
            }else {
                Console.WriteLine("FROM COOKIE: " + csrfFromCookie);
                Console.WriteLine("From Token: " + csrfTokenHeader);
            }
            if (!res)
            {
                context.Result = new StatusCodeResult(403);
            }
            else
            {
                base.OnActionExecuting(context);
            }
        }
    }
}
