namespace Engineer.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public byte[] Password { get; set; }
        public string Address { get; set; }
        public string Username { get; set; }
        public byte[] Salt { get; set; }
        public int OnTimePassword { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoinedDate { get; set; }
        public string RefreshToken { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateExpires { get; set; }
        public bool SuperUser  {get; set; }
        public string LockToken {get; set;}
        public bool Locked {get; set; }
    }
}
