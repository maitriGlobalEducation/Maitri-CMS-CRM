export interface TestimonialImage {
  url: string;
  publicId: string;
}

export interface Testimonial {
  _id: string;

  name: string;
  course: string;
  university: string;

  image: TestimonialImage | null;

  testimonial: string;

  createdAt: string;
  updatedAt: string;
}
