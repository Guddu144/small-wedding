


export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
     
      {/* Hero Section */}
      <section className="relative h-[380px] md:h-[420px] flex items-center justify-center text-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/videos/cloud.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0c3e58]/40 z-10" />
        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 mt-8">OUR STORY</h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            When you lose someone you love, it can be overwhelming to figure out what to do next. The myriad of decisions, from the funeral or memorial service details to handling the personal effects of your loved one, can feel insurmountable during a time of loss.
          </p>
        </div>
      </section>
      {/* Two-column Content Section */}
      <section className="bg-white py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="text-navy-900 text-base md:text-lg font-serif space-y-4">
            <p>
              At Celebration of Life Concierge, we're here to help carry that burden. With empathy and experience, we support you through every step of planning a meaningful farewell, so you can focus on what matters most: remembering, grieving, and celebrating your loved one's life.
            </p>
            <p>
              For over 30 years, we've helped families from all walks of life honor their loved ones through funerals, cremations, burials, and celebrations of life. We tailor each service to reflect the person's unique story, values, and cultural traditions.
            </p>
          </div>
          <div className="text-navy-900 text-base md:text-lg font-serif space-y-6">
            <p>
              Our goal is to create a heartfelt tribute that brings comfort and closure to those left behind. When you work with us, you gain more than a service — you gain a compassionate partner who understands the weight of loss and the healing power of remembrance.
            </p>
            <p>
              Let us guide you through this difficult time with care, respect, and genuine support.
            </p>
          </div>
        </div>
      </section>
      {/* Our Team Section */}
      <section className="relative py-16 px-4 md:px-0" style={{background: 'url(/images/backdrop/floral.png) right top/cover no-repeat, #f5f3ef'}}>
        <div className="max-w-4xl mx-auto mb-4">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-navy-900 mb-2">Our Team</h2>
          <p className="text-base md:text-lg text-navy-900/80 mb-8 max-w-4xl">
            Behind every memorable Celebration of Life is a dedicated Memorial Service Team, bringing together expertise, compassion, and a deep commitment to honor each unique life. At Celebration of Life Concierge, our team stands as the cornerstone of our service, adept at translating your loved one's stories and accomplishments into touching memorial ceremonies. Empathy and professionalism are at the heart of everything we do, ensuring that each Celebration of Life reflects the individuality and essence of those being remembered. Meet the exceptional individuals who make up our Memorial Service Team, each bringing their unique talents and heartfelt dedication to every service we provide.
          </p>
          <div className="flex flex-col gap-10">
            {/* Blane Ellsworth */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-full md:w-56 flex-shrink-0">
                <img src="/images/teams/image1.png" alt="Blane Ellsworth" className="rounded-xl w-full h-64 object-cover object-center" />
              </div>
              <div className="flex-1 text-navy-900">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">Blane Ellsworth</h3>
                <p className="text-sm md:text-lg font-serif mb-2">
                  Blane Ellsworth established Celebration of Life Concierge recognizing a trend from traditionally religious funeral observances to more personal, meaningful, and affirming memorials. Recognized for creating Celebration of Life Services which genuinely honor each individual's values, accomplishments, personality and character, Blane Ellsworth possesses an empathetic skill for being comforting and consoling.
                </p>
                <p className="text-base md:text-lg font-serif">
                  Blane will hear you and compassionately coordinate and conduct celebration of life services evocative of how the person you love desires to be remembered.
                </p>
              </div>
            </div>
            {/* Leslie Redmayne */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-full md:w-56 flex-shrink-0">
                <img src="/images/teams/image2.png" alt="Leslie Redmayne" className="rounded-xl w-full h-64 object-cover object-center" />
              </div>
              <div className="flex-1 text-navy-900">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">Leslie Redmayne</h3>
                <p className="text-base md:text-lg font-serif mb-2">
                  Leslie Redmayne-Titley has a long-established history in the event industry. After many years overseeing weddings, Leslie's planning expertise will be utilized as the Administrative Director of Celebration of Life Concierge.
                </p>
                <p className="text-base md:text-lg font-serif mb-2">
                  Leslie compliments her organizational excellence with her compassionate heart and her attentive listening skills while providing assurances through her attention to detail.
                </p>
                <p className="text-base md:text-lg font-serif">
                  With maturity and insightful focus, Leslie will thoughtfully work with you to proficiently plan a Celebration of Life Service with honorability and diligence.
                </p>
              </div>
            </div>
            {/* Darlene DeRose */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-full md:w-56 flex-shrink-0">
                <img src="/images/teams/image3.png" alt="Darlene DeRose" className="rounded-xl w-full h-64 object-cover object-center" />
              </div>
              <div className="flex-1 text-navy-900">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">Darlene DeRose</h3>
                <p className="text-base md:text-lg font-serif mb-2">
                  Darlene DeRose is a Co-Founder and Principal of ShadowPower LLC. She has served as a consultant in various capacities since 1994. As a filmmaker, she is passionate about recording people's life stories, to honor the gifts they bring to the world and to create a legacy for their family and friends to savor over time.
                </p>
                <p className="text-base md:text-lg font-serif">
                  She has advised family members on dozens of funeral services and life celebrations, on topics that include program development, music selection, timing and sharing by and with long-distance attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 