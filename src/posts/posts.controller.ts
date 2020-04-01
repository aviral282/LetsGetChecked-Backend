import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Comments } from '../data/comment';

@Controller()
export class PostsController {

    constructor(
        private readonly _postsService: PostsService) {
    }

    @Get('posts')
    async getAllPosts() {
        return this._postsService.getAllPosts();
    }

    @Get('posts/:id')
    async getPost(@Param('id') id) {
        return await this._postsService.getPostWithId(id);
    }

    @Get('posts/:id/comments')
    async getPostComments(@Param('id') id) {
        return this._postsService.getPostComments(id);
    }

    @Post('posts/:id/comments')
    async addComment(@Param('id') id, @Body() comment: Comments) {
        return this._postsService.addCommentOnPost(id, comment);
    }

    @Post('posts/:id/comments')
    async addComment(@Param('id') id, @Body() comment: Comments) {
        return this._postsService.addCommentOnPost(id, comment);
    }

    @Put('comments/:id')
    async updateComment(@Param('id') toChangeID, @Body() comment: Comments) {
        return this._postsService.updateCommentOfId(toChangeID, comment);
    }
}
