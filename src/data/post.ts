export class Post{
    id;
    title;
    author;
    publishDate;
    slug;
    description;
    content;
    activity : Comments[] = [];
}