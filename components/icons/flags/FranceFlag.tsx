export default function FranceFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#ED2939"/>
      <rect width="600" height="600" fill="#fff"/>
      <rect width="300" height="600" fill="#002395"/>
    </svg>
  );
}
