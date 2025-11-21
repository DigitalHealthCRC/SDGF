import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const filename = searchParams.get("file")

    if (!filename) {
        return new NextResponse("Filename is required", { status: 400 })
    }

    // Basic security check to prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return new NextResponse("Invalid filename", { status: 400 })
    }

    const pdfDir = path.join(process.cwd(), "src/content/appendices_pdf")
    const filePath = path.join(pdfDir, filename)

    if (!fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 })
    }

    try {
        const fileBuffer = fs.readFileSync(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error("Error reading file:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
