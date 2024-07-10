import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: {params: any}) => {  
    const blogId = context.params.blog;
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing user ID"}),{
                status: 400,
            })
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing category ID"}),{
                status: 400,
            })
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing blog ID"}),{
                status: 400,
            })
        }

        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}), {
                    status: 400,
                }
            );
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found in the database"}), {
                    status: 400,
                }
            );
        }
        
        const blog = await Blog.findOne({
            _id: blogId,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        });

        if(!blog){
            return new NextResponse(
                JSON.stringify({message: "Blog not found"}), {
                    status: 400,
                }
            )
        }

        return new NextResponse(JSON.stringify({blog}),{
            status: 200
        })

    }catch(err: any){
        return new NextResponse("Error in fetching blogs" + err.message, {
            status:500
        });
    }
}

export const PATCH = async (request: Request, context: {params:any}) => {
    const blogId = context.params.blog;
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        const body = await request.json();
        const {title, description} = body;


        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing user ID"}),{
                status: 400,
            })
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing blog ID"}),{
                status: 400,
            })
        }

        await connect();

        const user = await User.findById(userId);

        if(!user) {
            return new NextResponse(JSON.stringify({message:"User not found"}),{
                status: 400,
            });
        }

        const blog = await Blog.findOne({_id: blogId, user: userId});

        if(!blog) {
            return new NextResponse(JSON.stringify({message:"Blog not found"}),{
                status: 400,
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {title, description},
            {new: true}
        );

        return new NextResponse(
            JSON.stringify({message: "Blog is updated", blog: updatedBlog}),{
                status: 200,
            }
        );

    }catch(err:any){
        return new NextResponse("Error in updating blog" + err.message,{
            status: 500,
        });
    }
};

export const DELETE = async (request: Request, context: {params: any}) =>{
    const blogId = context.params.blog;
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');



        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing user ID"}),{
                status: 400,
            })
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:"Invalid or missing blog ID"}),{
                status: 400,
            })
        }

        await connect();

        const user = await User.findById(userId);

        if(!user) {
            return new NextResponse(JSON.stringify({message:"User not found"}),{
                status: 400,
            });
        }

        const blog = await Blog.findOne({_id: blogId, user: userId});

        if(!blog) {
            return new NextResponse(JSON.stringify({message:"Blog not found"}),{
                status: 400,
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        return new NextResponse(
            JSON.stringify({message: "Blog is deleted", blog: deletedBlog}),{
                status: 200,
            }
        );


    }catch(err:any){
        return new NextResponse("Error in deleting blog " + err.message,{
            status: 500,
        })
    }
}