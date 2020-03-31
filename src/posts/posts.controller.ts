import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

    constructor(
        private readonly _postsService: PostsService) { }

    @Get('/')
    async getAllPosts(){
        return await this._postsService.getAllPosts();
    }

    @Get(':id')
    async getPost(@Param('id') id) {
        return await this._postsService.getPostWithId(id);
    }

    @Get(':id/comments')
    async getPostComments(@Param('id') id) {
        return await this._postsService.getPostComments(id);
    }
}
