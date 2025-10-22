// This file is no longer used - onboarding has been removed
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [userData, setUserData] = useState<UserData>({
    role: null,
    location: "",
    budget: [500, 800],
    roommateStyle: "",
    interests: [],
    housingType: ""
  });

  const handleNext = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("role");
        break;
      case "role":
        // Skip preferences for guest users
        if (userData.role === "guest") {
          setCurrentStep("success");
        } else {
          setCurrentStep("preferences");
        }
        break;
      case "preferences":
        setCurrentStep("success");
        break;
      case "success":
        onNext(userData);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "role":
        setCurrentStep("welcome");
        break;
      case "preferences":
        setCurrentStep("role");
        break;
      case "success":
        // If guest, go back to role selection, otherwise to preferences
        if (userData.role === "guest") {
          setCurrentStep("role");
        } else {
          setCurrentStep("preferences");
        }
        break;
    }
  };

  const selectRole = (role: UserRole) => {
    setUserData({ ...userData, role });
  };

  const toggleInterest = (interest: string) => {
    const updatedInterests = userData.interests.includes(interest)
      ? userData.interests.filter(i => i !== interest)
      : [...userData.interests, interest];
    setUserData({ ...userData, interests: updatedInterests });
  };

  const isNextEnabled = () => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "role":
        return userData.role !== null;
      case "preferences":
        return userData.location && userData.roommateStyle && userData.housingType;
      case "success":
        return true;
      default:
        return false;
    }
  };

  const getProgressPercent = () => {
    if (userData.role === "guest") {
      // Guest flow: welcome -> role -> success (3 steps)
      switch (currentStep) {
        case "welcome": return 33;
        case "role": return 66;
        case "success": return 100;
        default: return 0;
      }
    } else {
      // Full flow: welcome -> role -> preferences -> success (4 steps)
      switch (currentStep) {
        case "welcome": return 25;
        case "role": return 50;
        case "preferences": return 75;
        case "success": return 100;
        default: return 0;
      }
    }
  };

  // Welcome Screen
  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)] via-[var(--color-easyCo-purple-light)] to-[var(--color-easyCo-mustard)] flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-white/20 h-1">
          <div 
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Logo Area */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Home className="w-12 h-12 text-[var(--color-easyCo-purple)]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome to EasyCo
            </h1>
            <p className="text-xl text-white/90 font-medium">
              Secure, simple, and modern coliving
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="w-80 h-60 rounded-3xl overflow-hidden mb-8 shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1738455044735-7e887062b72e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxjb21lJTIwaG9tZSUyMGlsbHVzdHJhdGlvbiUyMGNvbGl2aW5nfGVufDF8fHx8MTc1ODQ3NTc0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Welcome to EasyCo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--color-easyCo-mustard)]" />
              <span className="text-lg">Find your perfect shared living space</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--color-easyCo-mustard)]" />
              <span className="text-lg">Connect with like-minded roommates</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--color-easyCo-mustard)]" />
              <span className="text-lg">Manage expenses and bookings easily</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="w-full max-w-sm bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl h-14 text-lg font-semibold"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-white/70 text-sm mt-4">
            Join thousands of happy colivers in Brussels
          </p>
        </div>
      </div>
    );
  }

  // Role Selection Screen
  if (currentStep === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-easyCo-gray-light)] h-1">
          <div 
            className="h-full bg-[var(--color-easyCo-purple)] transition-all duration-500"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 text-[var(--color-easyCo-purple)]"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-[var(--color-easyCo-purple)] mb-2">
            Who are you? 🏠
          </h1>
          <p className="text-[var(--color-easyCo-gray-dark)] text-lg">
            Choose your role to get personalized experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="flex-1 px-6 pb-6 space-y-4">
          {/* Tenant Card */}
          <Card 
            onClick={() => selectRole("tenant")}
            className={`cursor-pointer transition-all duration-300 border-0 rounded-3xl overflow-hidden ${
              userData.role === "tenant" 
                ? 'ring-4 ring-[var(--color-easyCo-mustard)] shadow-lg scale-105' 
                : 'shadow-sm hover:shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1727875075949-8b36efd25260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjB0ZW5hbnQlMjB5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NTg0NzU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Happy tenant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-easyCo-purple)] mb-1">
                    I'm looking for a room 🔍
                  </h3>
                  <p className="text-[var(--color-easyCo-gray-dark)]">
                    Student or young professional searching for the perfect shared living space
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <Users className="w-4 h-4" />
                  <span>Find compatible roommates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <MapPin className="w-4 h-4" />
                  <span>Search in your preferred areas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <DollarSign className="w-4 h-4" />
                  <span>Manage shared expenses easily</span>
                </div>
              </div>
              
              {userData.role === "tenant" && (
                <Badge className="mt-4 bg-[var(--color-easyCo-mustard)] text-black">
                  Selected ✓
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Landlord Card */}
          <Card 
            onClick={() => selectRole("landlord")}
            className={`cursor-pointer transition-all duration-300 border-0 rounded-3xl overflow-hidden ${
              userData.role === "landlord" 
                ? 'ring-4 ring-[var(--color-easyCo-mustard)] shadow-lg scale-105' 
                : 'shadow-sm hover:shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1730808465658-e8703d1dc5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGxhbmRsb3JkJTIwcHJvcGVydHklMjBvd25lcnxlbnwxfHx8fDE3NTg0NzU3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Happy landlord"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-easyCo-purple)] mb-1">
                    I have properties to rent 🏗️
                  </h3>
                  <p className="text-[var(--color-easyCo-gray-dark)]">
                    Property owner looking to rent rooms or manage coliving spaces
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <Building className="w-4 h-4" />
                  <span>Manage multiple properties</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <Users className="w-4 h-4" />
                  <span>Screen and match tenants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <DollarSign className="w-4 h-4" />
                  <span>Track finances and performance</span>
                </div>
              </div>
              
              {userData.role === "landlord" && (
                <Badge className="mt-4 bg-[var(--color-easyCo-mustard)] text-black">
                  Selected ✓
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Guest Card */}
          <Card 
            onClick={() => selectRole("guest")}
            className={`cursor-pointer transition-all duration-300 border-0 rounded-3xl overflow-hidden ${
              userData.role === "guest" 
                ? 'ring-4 ring-[var(--color-easyCo-mustard)] shadow-lg scale-105' 
                : 'shadow-sm hover:shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1535009427281-a315ca1bc9aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3JlJTIwZGlzY292ZXIlMjBicm93c2luZyUyMGd1ZXN0fGVufDF8fHx8MTc1ODQ3NjEzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Explore as guest"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-easyCo-purple)] mb-1">
                    Just browsing for now 👀
                  </h3>
                  <p className="text-[var(--color-easyCo-gray-dark)]">
                    Explore EasyCo without creating an account. No commitment required!
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <Search className="w-4 h-4" />
                  <span>Browse available properties</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <MapPin className="w-4 h-4" />
                  <span>Explore different neighborhoods</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                  <Star className="w-4 h-4" />
                  <span>Get a feel for the platform</span>
                </div>
              </div>
              
              {userData.role === "guest" && (
                <Badge className="mt-4 bg-[var(--color-easyCo-mustard)] text-black">
                  Selected ✓
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleNext}
            disabled={!isNextEnabled()}
            className="w-full bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-2xl h-14 text-lg disabled:opacity-50"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Preferences Screen
  if (currentStep === "preferences") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-easyCo-gray-light)] h-1">
          <div 
            className="h-full bg-[var(--color-easyCo-purple)] transition-all duration-500"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 text-[var(--color-easyCo-purple)]"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-[var(--color-easyCo-purple)] mb-2">
            Tell us about yourself ✨
          </h1>
          <p className="text-[var(--color-easyCo-gray-dark)] text-lg">
            Help us find your perfect {userData.role === "landlord" ? "tenants" : "coliving match"}
          </p>
        </div>

        {/* Preferences Form */}
        <div className="flex-1 px-6 pb-6 space-y-8 overflow-auto">
          {/* Location */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-easyCo-purple)] mb-3">
              📍 Preferred Location
            </label>
            <Input
              placeholder={userData.role === "landlord" ? "Where are your properties?" : "Where do you want to live?"}
              value={userData.location}
              onChange={(e) => setUserData({ ...userData, location: e.target.value })}
              className="rounded-2xl border-[var(--color-easyCo-gray-medium)] h-12 text-lg"
            />
          </div>

          {/* Budget (for tenants) or Property Type (for landlords) */}
          {userData.role === "tenant" ? (
            <div>
              <label className="block text-lg font-semibold text-[var(--color-easyCo-purple)] mb-3">
                💰 Monthly Budget
              </label>
              <div className="px-4">
                <Slider
                  value={userData.budget}
                  onValueChange={(value) => setUserData({ ...userData, budget: value })}
                  max={1500}
                  min={300}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[var(--color-easyCo-gray-dark)] mt-2">
                  <span>€{userData.budget[0]}</span>
                  <span className="font-semibold">€{userData.budget[0]} - €{userData.budget[1]}</span>
                  <span>€{userData.budget[1]}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-semibold text-[var(--color-easyCo-purple)] mb-3">
                🏠 Property Type
              </label>
              <Select value={userData.housingType} onValueChange={(value) => setUserData({ ...userData, housingType: value })}>
                <SelectTrigger className="rounded-2xl border-[var(--color-easyCo-gray-medium)] h-12 text-lg">
                  <SelectValue placeholder="What type of properties do you have?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartments">Apartments</SelectItem>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="studios">Studios</SelectItem>
                  <SelectItem value="mixed">Mixed Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Living Style */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-easyCo-purple)] mb-3">
              🏡 {userData.role === "landlord" ? "Target Tenant Style" : "Living Style"}
            </label>
            <Select value={userData.roommateStyle} onValueChange={(value) => setUserData({ ...userData, roommateStyle: value })}>
              <SelectTrigger className="rounded-2xl border-[var(--color-easyCo-gray-medium)] h-12 text-lg">
                <SelectValue placeholder={userData.role === "landlord" ? "What type of tenants do you prefer?" : "What's your ideal living situation?"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social & Outgoing</SelectItem>
                <SelectItem value="quiet">Quiet & Studious</SelectItem>
                <SelectItem value="professional">Working Professionals</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="mixed">Mixed Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests/Amenities */}
          <div>
            <label className="block text-lg font-semibold text-[var(--color-easyCo-purple)] mb-3">
              🎯 {userData.role === "landlord" ? "Property Features" : "Interests & Lifestyle"}
            </label>
            <p className="text-[var(--color-easyCo-gray-dark)] mb-3">
              {userData.role === "landlord" ? "Select amenities your properties offer" : "Select what matters to you"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(userData.role === "landlord" ? [
                { id: "parking", icon: "🚗", label: "Parking" },
                { id: "kitchen", icon: "🍳", label: "Full Kitchen" },
                { id: "garden", icon: "🌱", label: "Garden/Balcony" },
                { id: "wifi", icon: "📶", label: "High-speed WiFi" },
                { id: "laundry", icon: "👕", label: "Laundry" },
                { id: "furnished", icon: "🛋️", label: "Furnished" }
              ] : [
                { id: "studying", icon: BookOpen, label: "Studying" },
                { id: "cooking", icon: Coffee, label: "Cooking" },
                { id: "music", icon: Music, label: "Music" },
                { id: "gaming", icon: Gamepad2, label: "Gaming" },
                { id: "fitness", icon: Dumbbell, label: "Fitness" },
                { id: "socializing", icon: Users, label: "Socializing" }
              ]).map(interest => (
                <Button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  variant={userData.interests.includes(interest.id) ? "default" : "outline"}
                  className={`h-16 rounded-2xl flex flex-col gap-1 ${
                    userData.interests.includes(interest.id)
                      ? 'bg-[var(--color-easyCo-purple)] text-white'
                      : 'border-[var(--color-easyCo-gray-medium)] hover:border-[var(--color-easyCo-purple)]'
                  }`}
                >
                  {typeof interest.icon === 'string' ? (
                    <span className="text-xl">{interest.icon}</span>
                  ) : (
                    <interest.icon className="w-6 h-6" />
                  )}
                  <span className="text-sm">{interest.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleNext}
            disabled={!isNextEnabled()}
            className="w-full bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-2xl h-14 text-lg disabled:opacity-50"
          >
            Complete Setup
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Success Screen
  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-easyCo-gray-light)] h-1">
          <div 
            className="h-full bg-[var(--color-easyCo-purple)] transition-all duration-500"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Success Illustration */}
          <div className="w-80 h-60 rounded-3xl overflow-hidden mb-8 shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609378622049-0b3e45d776f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwY2VsZWJyYXRpb24lMjBhY2hpZXZlbWVudCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NTg0NzU3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Success celebration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-easyCo-purple)] mb-3">
              {userData.role === "guest" ? "🚀 Ready to explore!" : "🎉 You're all set!"}
            </h1>
            <p className="text-lg text-[var(--color-easyCo-gray-dark)] mb-6">
              {userData.role === "guest" 
                ? "Welcome to EasyCo! Feel free to browse properties and explore features. You can create an account anytime to access more features."
                : "Welcome to the EasyCo community! We've personalized your experience based on your preferences."
              }
            </p>
          </div>

          {/* Summary Card */}
          <Card className="w-full max-w-sm mb-8 border-0 rounded-3xl shadow-lg bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-easyCo-purple)] rounded-2xl flex items-center justify-center">
                  {userData.role === "landlord" ? (
                    <Building className="w-6 h-6 text-white" />
                  ) : userData.role === "guest" ? (
                    <Search className="w-6 h-6 text-white" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                    {userData.role === "landlord" ? "Property Owner" : 
                     userData.role === "guest" ? "Guest Explorer" : "Room Seeker"}
                  </h3>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)]">
                    {userData.role === "guest" ? "Browsing mode" : (userData.location || "Brussels area")}
                  </p>
                </div>
              </div>
              
              {userData.role === "guest" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[var(--color-easyCo-mustard)]" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">
                      Explore Brussels properties
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[var(--color-easyCo-mustard)]" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">
                      No account required
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {userData.role === "tenant" && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-[var(--color-easyCo-mustard)]" />
                      <span className="text-sm text-[var(--color-easyCo-gray-dark)]">
                        Budget: €{userData.budget[0]} - €{userData.budget[1]}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[var(--color-easyCo-mustard)]" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">
                      {userData.roommateStyle || "Flexible"} lifestyle
                    </span>
                  </div>
                  
                  {userData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.slice(0, 3).map(interest => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {userData.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{userData.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="w-full max-w-sm bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl h-14 text-lg font-semibold mb-4"
          >
            {userData.role === "landlord" ? "Start Managing Properties" : 
             userData.role === "guest" ? "Start Exploring" : "Start Finding Rooms"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-[var(--color-easyCo-gray-dark)] text-sm">
            {userData.role === "guest" 
              ? "Create an account anytime to unlock personalized features"
              : "You can update your preferences anytime in your profile"
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
}