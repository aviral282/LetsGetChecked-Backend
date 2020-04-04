export class Comments {
    id;
    user;
    date;
    content;
    replies: Comments[] = [];
}