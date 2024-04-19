import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

export const GET = async () => {
}
export const POST = async (request: Request, response: Response) => {
    const { } = await request.json();
}