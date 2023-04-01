namespace Engineer.Models {
    public class ResetPasswordModel {
        public string Password {get; set; } = string.Empty;
        public string  ConformPaaword {get; set; } = string.Empty;
        public string LockToken {get; set; } = string.Empty;
        public string Username {get; set;} = string.Empty;
        public int Code {get; set;}
    }
}