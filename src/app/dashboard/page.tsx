import { 
    Sprout, Briefcase, Building, ArrowRight, ArrowLeft, Leaf, Apple
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@veap/lib/supabase/server'; 
import { TextAnimate } from '@veap/components/magicui/text-animate';
import { BlurFade } from '@veap/components/magicui/blur-fade';
import { AuroraText } from '@veap/components/magicui/aurora-text';


interface ProjectCardProps {
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, icon, title, description, href }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col">
      <div className="relative w-full h-48">
        <Image 
          src={imageSrc}
          alt={`[Gambar ilustrasi untuk ${title}]`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="mt-4 text-gray-600 flex-grow">{description}</p>
        <Link 
          href={href}
          className="mt-6 bg-blue-900 text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Access Dashboard</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const PortalHeader: React.FC = () => {
  return (
    <header className="bg-transparent absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto md:px-20 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
          <span className="text-xl sm:text-2xl font-bold text-gray-800">
            IoT Dashboard <AuroraText>Center</AuroraText>
          </span>
        </div>
        <Link href="/" className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center gap-2 border border-gray-200 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className='hidden md:inline'>Back to Main Site</span>
        </Link>
      </div>
    </header>
  );
};

export default async function DashboardPortalPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    console.error('Session check failed:', e);
  }
  const isLoggedIn = !!user;

  const projectData: ProjectCardProps[] = [
    {
      imageSrc: "/images/green-pyramid-dash.png",
      icon: <Sprout className="h-8 w-8 text-green-700" />,
      title: "Green Pyramid",
      description: "University research greenhouse monitoring for tropical plants and conservation.",
      href: isLoggedIn ? "/dashboard/green-pyramid" : "/login?dashboard=green-pyramid"
    },
    {
      imageSrc: "/images/smartdec-dash.png",
      icon: <Briefcase className="h-8 w-8 text-blue-700" />,
      title: "Smartdec",
      description: "Smart portable monitoring system for open-field precision agriculture.",
      href: isLoggedIn ? "/dashboard/smartdec" : "/login?dashboard=smartdec"
    },
    {
      imageSrc: "/images/hidroponik-indoor-dash.png",
      icon: <Building className="h-8 w-8 text-purple-700" />,
      title: "Indoor Hidroponic",
      description: "Micro-environment control for efficient indoor hydroponic vegetable cultivation.",
      href: isLoggedIn ? "/dashboard/indoor-hidroponic" : "/login?dashboard=indoor-hidroponic"
    },
    {
      imageSrc: "/images/green-pyramid-dash.png",
      icon: <Apple className="h-8 w-8 text-cyan-700" />,
      title: "Vertagri",
      description: "Veteran Smart Agriculture for urban farming and educational purposes.",
      href: isLoggedIn ? "/dashboard/vertagri" : "/login?dashboard=vertagri"
    },
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <PortalHeader />

      <main className="flex items-center justify-center min-h-screen py-24 px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            <TextAnimate animation="blurInUp" by="word" once>Choose Your Dashboard System</TextAnimate>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Each system is designed for specific needs. Please select the appropriate dashboard to begin monitoring.
          </p>

          <BlurFade direction='up' delay={0.25}>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {projectData.map((data, index) => (
                    <ProjectCard key={index} {...data} />
                ))}
            </div>
          </BlurFade>
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500 bg-gray-50">
        &copy; {new Date().getFullYear()} IoT Dashboard Center | Veteran Education Agro Park
      </footer>
    </div>
  );
};
