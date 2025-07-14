
import Typography from '@mui/material/Typography'
import PageContainer from "@/app/components/container/PageContainer";
import Users from '@/app/components/shared/Users';


export default function SamplePage() {

 
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Users/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
