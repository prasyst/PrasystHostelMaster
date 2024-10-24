const AuthHeader = ()=>{
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJWYWxpZElzc3VlciI6IlByYXN5c3QiLCJWYWxpZEF1ZGllbmNlIjoiUHJhc3lzdCJ9.gMMGQ74cWLoymeDv0D4c3UQKTEJSCzdkXoxlW4qF5QU';
       return { 
        headers :  {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
       }
}

export default AuthHeader;