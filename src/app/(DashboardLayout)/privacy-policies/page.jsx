
import PageContainer from "@/app/components/container/PageContainer";
import PrivacyPolicies from "@/app/components/shared/PrivacyPolicies";


export default function SamplePage() {

 
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <PrivacyPolicies/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
