import * as fs from 'fs';
import * as cloneDeep from 'lodash/cloneDeep';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/data/post';
import { Comments } from 'src/data/comment';

@Injectable()
export class PostsService {

    posts: Post[] = [];
    comment_id_generator = 0;

    constructor() {
        this.readFile('src/assets/data.json').then(data => {
            data['posts'].forEach(element => {
                element.activity = [];
                this.posts.push(element as Post);
            });

            data['comments'].forEach(element => {
                this.addToTree(element);
            });
        });
    }

    addToTree(element) {
        const postId = element['postId'];
        const parentId = element['parent_id'];
        const comment = element;
        delete comment.postId;
        delete comment.parent_id;
        comment.replies = [];

        this.comment_id_generator++;

        if (parentId == null) {
            this.getPostById(postId).activity.push(comment);
        } else {
            this.getPostById(postId).activity.forEach(element => {
                const foundParent = this.findParent(parentId, element);
                if (foundParent != null)
                    foundParent.replies.push(comment);
            });
        }
    }

    findParent(targetId, root: Comments) {
        if (root.id == targetId) {
            return root;
        } else {
            for (let index = 0; index < root.replies.length; index++) {
                const element = root.replies[index];

                const foundParent = this.findParent(targetId, element);
                if (foundParent != null) {
                    return foundParent;
                }
            }
            return null;
        }
    }

    getPostById(id): Post {
        const foundPosts = this.posts.filter(post => post.id == id);
        if (foundPosts.length > 0)
            return foundPosts[0];
        else
            return new Post();
    }

    getPostComments(id) {
        const foundPost = this.getPostById(id);
        if (foundPost.hasOwnProperty('slug')) {
            return foundPost.activity;
        } else
            return { 'code': 10, 'message': 'Post Not Found' };
    }

    getPostWithId(id) {
        const foundPost = this.getPostById(id);
        if (foundPost.hasOwnProperty('slug')) {
            const post = cloneDeep(foundPost);
            delete post.activity;
            return post;
        } else
            return { 'code': 10, 'message': 'Post Not Found' };
    }

    getAllPosts() {
        return cloneDeep(this.posts).filter(post => delete post.activity);
    }

    addCommentOnPost(postId, comment: Comments) {
        const foundPost = this.getPostById(postId);
        if (!foundPost.hasOwnProperty('slug'))
            return { 'code': 10, 'message': 'Post Not Found' };

        comment['id'] = this.comment_id_generator;
        comment['postId'] = postId;
        this.addToTree(comment);
        return { 'code': 2, 'success': 'Successfully added comment' };
    }

    findCommentById(commentId): Comments {
        for (let i = 0; i < this.posts.length; i++) {
            const post = this.posts[i];
            for (let j = 0; j < post.activity.length; j++) {
                const comment = post.activity[j];
                const foundComment = this.findParent(commentId, comment);

                if (foundComment != null) {
                    return foundComment;
                }
            }
        }
        return null;
    }

    updateCommentOfId(toChangeID, comment: Comments) {
        const foundComment = this.findCommentById(toChangeID);
        if (foundComment != null) {
            foundComment.user = comment.user;
            foundComment.content = comment.content;
            foundComment.date = comment.date;
            return { 'code': 2, 'success': 'Successfully updated comment' };
        } else {
            return { 'code': 10, 'message': 'Comment not found' };
        }
    }

    async readFile(filePath) {
        return new Promise(function(resolve, reject) {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
}
