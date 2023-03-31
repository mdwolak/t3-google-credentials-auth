import { Html, Head, Main, NextScript } from 'next/document'

function MyDocument() {
    return (
        <Html className="h-full bg-gray-50">
            <Head />
            <body className="h-full desktop-transparent bg-gray-50 antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default MyDocument