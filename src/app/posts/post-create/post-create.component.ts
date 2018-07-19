import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "./mime-type-validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.form = new FormGroup({
      title:  new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.editPost();
  
  }

  editPost(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = 
          { id: postData._id, 
            title: postData.title, 
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
            
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onImagePicked(event: Event){
    //HTML Element which has a  files property
    //type conversion expression is an html input element with files property, files is an array but we only want the first file selected in this case
    const file = (event.target as HTMLInputElement).files[0];
    // patch value targets a single controll
    // image is the control, file is the object stored
    this.form.patchValue({image: file});
    //Informs angular that it changes the value, reevaluated it, store it and check that it is valid
    this.form.get('image').updateValueAndValidity();
  
    console.log('file', file);
    console.log('this form', this.form);

    //PREVIEW
    const reader = new FileReader(); // File reader is a js feature

    // async code
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    //load it
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title, 
        this.form.value.content, 
        this.form.value.image
      );
      
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
    
  }


}