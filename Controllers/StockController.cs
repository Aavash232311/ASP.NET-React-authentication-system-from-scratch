using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Engineer.Controllers {
    [ApiController]
    [Route("stock")]
    public class StockController: ControllerBase {
        [HttpPut]  //*ok

        [Authorize]

        [ValidateAntiForgeryToken]

        public async Task<ActionResult> Save()

        {
            return Ok();
        }
    }
}