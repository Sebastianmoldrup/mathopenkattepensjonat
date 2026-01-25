interface User {
  auth: string;
  email: string;
}

export default function BookingFormComponent(user: User) {
  console.log("user:", user);
  return <div></div>;
}
