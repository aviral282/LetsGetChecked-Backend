import * as fs from 'fs';
import * as cloneDeep from 'lodash/cloneDeep';
import { Injectable } from '@nestjs/common';
import { Post } from 'src/data/post';
import { Comments } from 'src/data/comment';

@Injectable()
export class PostsService {

    posts: Post[] = [];
    
    constructor(){
        this.readFile('src/assets/data.json').then(data => {
            data['posts'].forEach(element => {
                element.activity = [];
                this.posts.push(element as Post);
            });

            data['comments'].forEach(element => {
                this.addToTree(element);
            });
        })
    }

    addToTree(element){
        let postId = element['postId'];
        let parentId = element['parent_id'];
        let comment = element;
        delete comment.postId
        delete comment.parent_id
        comment.replies = [];

        if(parentId == null){
            this.getPostById(postId).activity.push(comment);
        } else {
            this.getPostById(postId).activity.forEach(element => {
                this.findParent(parentId, element).replies.push(comment);
            });
        }
    }

    findParent(targetId, root: Comments){
        if(root.id == targetId){
            return root;
        }else{
            for (let index = 0; index < root.replies.length; index++) {
                const element = root.replies[index];
                
                let foundParent = this.findParent(targetId, element);
                if(foundParent != null){
                    return foundParent;
                }                                
            }
            return null;
        }
    }

    getPostById(id) : Post{
        let foundPosts = this.posts.filter(post => post.id == id);
        if(foundPosts.length > 0)
            return foundPosts[0];
        else
            return new Post();
    }

    getPostComments(id){
        let foundPost = this.getPostById(id);
        if(foundPost.hasOwnProperty('slug')){
            return foundPost.activity;
        }else
            return {'code':404, 'message':'Post Not Found'};
    }
    
    getPostWithId(id) {
        let foundPost = this.getPostById(id);
        if(foundPost.hasOwnProperty('slug')){
            let post = cloneDeep(foundPost);
            delete post.activity;
            return post;
        }else
            return {'code':404, 'message':'Post Not Found'};
    }

    getAllPosts(){
        return cloneDeep(this.posts).filter(post => delete post.activity);
    }

    async readFile(filePath){
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
