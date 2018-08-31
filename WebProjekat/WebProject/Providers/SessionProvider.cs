using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Providers
{
    public class SessionProvider
    {
        private static SessionProvider instance;

        public static SessionProvider GetInstance()
        {
            if(instance == null)
            {
                instance = new SessionProvider();
            }

            return instance;
        }

        Dictionary<uint, Dictionary<string, object>> sessions;

        public SessionProvider()
        {
            sessions = new Dictionary<uint, Dictionary<string, object>>();
        }

        public uint CreateNewSession()
        {
            uint randomId;

            do
            {
                var buffer = new byte[sizeof(uint)];
                new Random().NextBytes(buffer);
                randomId = BitConverter.ToUInt32(buffer, 0);
            }
            while (sessions.ContainsKey(randomId));

            sessions[randomId] = new Dictionary<string, object>();
            return randomId;
        }

        public Dictionary<string, object> GetSession(uint id)
        {
            if (sessions.ContainsKey(id))
                return sessions[id];

            return null;
        }

        public void DeleteSession(uint id)
        {
            sessions.Remove(id);
        }
    }
}