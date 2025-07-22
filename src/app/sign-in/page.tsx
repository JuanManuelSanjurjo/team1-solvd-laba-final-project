import Input from "@/components/Input";

export default function SignIn() {
  return (
    <div>
      <h1>Sign In Page</h1>
      
      <Input error={true} errorMessage="Error" placeholder="Placeholder" label="Name" name="Name" required/>
      
    </div>
  );
}
