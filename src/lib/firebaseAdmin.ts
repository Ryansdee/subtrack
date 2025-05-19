import * as admin from "firebase-admin";

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCY04+OF8rP2dQq
pL3GAv1Ve0gFfYi01E3ImaLNOexkucRH1njW0b/FNYyX+EFR9YE2gD9+GrpU9eik
3gOgTM1mN5M+i1tSGVHpkfN2GLlYX6Uplm0wdlmo5gENDzFWc1MGegYtmy6djU5p
KflOBbUdoL3EVofI5SzmK3g+cdb364ibZIJv8U2+YO37jgNZa8BdB77jyXlVnLqJ
7tjecURLpyoipYSzVz+kOgaqIkxxvFEoWM1/C2TRLoUsFXaJIgzvNqq2b4IWqu7L
1PySfCUQZ0J/WtIQqHmdekExqp5XvHQ30Bvvf8up5dfMsvlsHXNha2rp648i7iuH
T8193LDBAgMBAAECggEAAXsswoCfh2ksjGdBVu3I0m8Z8ReuNKvJad7MpvbfQCX+
wtV6IVbcvXFkle/Ng5kAshcHG9aaz1+nbBBMx7JxhoKWYOj32cauC7ii5pZHFutX
uJyhHUhLBn8y1mi7HoPf857zeAtaJc5sn/SiBRa6vSPwLZAgdnAmLGrnxO8p2V2W
rHmZcuHYxk5jTOOZU1Q0879MyMQT2s8eaBFbY4WAMQdCQwzJCOc2qa+vSK0ag54S
h4KHXcE2iK1sohO+MBgVCyuUVQtU/v+lgDQlmX5gD0mz/PUQ4SaRCI27/HuDd+Ln
U54XVi5i/VTlJHpxR5DtlxMazA0xbIapr1nO2uaIAwKBgQDXSiCgrHAuErq7JRzm
BBNc6v9oFrNRvpiBxZUmOkU4GBGXROsqn9czl99L9JTZIMOFVRbKfIyZuo1cnO9z
Coyjni9etFGcHta2e5Q2KSVYhjyXOVrDIt8O2seBqNVs6ukV83ZIrRE8jfO6ZE+3
3zZfPaDwyx/bFBLbYoWyz81J/wKBgQC1ua2CleiTWX9DDJ/qYJ4RpWLgezCjxeoj
dv5+OjdQcEMrKM81dSNjNpniiEFmZaBnO448qkOQWvZYHiUImSSSH6xXpY1S27Fb
Xxsrc6B3ohvp8wTCVJWvofGbX+yFs5yJHY61qQ0FUIW03nH/YWyxH9D6OatV2+di
8mls0RqFPwKBgBq/HNqZUb6HmSdS7wosi3NJxr1ZxKFtOmk08Ni0+JCFfPn8F/NN
tGC2h4laM3veNCxGa/RwEM+we4t7+8uhDePt7Rio8lKhCi/Vno40Am3DD5gCCiKg
HHIuAAc9wHYtoROXEaTpy3BoelU3zSec1ZZzg6EmuyhukAEtdkrGwkxlAoGBAKk4
8p47wowUNzHUu8WhmxCLlfu8O5sGXfYQhQQ+aev53lJ+ehYpsn5dBgexIlWcJTZ8
ewN6+defHO8JgyrykN+RpwcnHucdtZaEheR8k91Tk/LTXocoBQu8HiS1uqb2jroQ
UChR99IPHbNDwZwyuOhn3E5nDWmykVHOsuWmArA5AoGAS3D1AxjzzhynFA3o/bYz
tKyB/Eq+/tQvvwlD0UhC2vfGW274o0vtThRYIfof/4EbZMlo/BwAQ3I9ky0yIJCg
p5thTk66BVyzso9wenAGoWubDtXLwEgLCQelhDX7KkwTkVKOfCK8Vsm4gjDvlTgz
qRzQ7lsTG5H2+hF/cso7At4=
-----END PRIVATE KEY-----`;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "subtrack-2fe6f",
      clientEmail: "firebase-adminsdk-fbsvc@subtrack-2fe6f.iam.gserviceaccount.com",
      privateKey,
    }),
  });
}


export default admin;
