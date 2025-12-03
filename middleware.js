import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. هات قيمة الكوكي
  const verify = request.cookies.get("loggedin");
  
  // 2. هات المسار اللي اليوزر عاوز يروحه
  const { pathname } = request.nextUrl;

  // 3. حدد الصفحات اللي محتاجة حماية (مثلاً أي حاجة بتبدأ بـ FrontPage)
  if (pathname.startsWith('/FrontPage')) {
    
    // لو الكوكي مش موجودة أصلاً، أو قيمتها false
    if (!verify || verify.value === 'false') {
      
      // توجيه للصفحة الرئيسية (Login)
      // new URL('/', request.url) -> دي الطريقة السحرية اللي بتشتغل في أي مكان
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 4. لو عدى من الشروط اللي فوق، أو رايح صفحة مش محمية -> عدي يا بطل
  return NextResponse.next();
}

// 5. (اختياري بس مستحسن) حدد الميدل وير يشتغل فين بالظبط عشان ما يتقلش الموقع
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
