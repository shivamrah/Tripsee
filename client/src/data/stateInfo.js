const STATE_INFO = {
    "Andhra Pradesh": {
        description:
            "A southeastern state known for its long coastline, historic temples and cuisine.",
        imageQuery: "Andhra Pradesh city",
        imagePath: "https://media.istockphoto.com/id/1285898933/photo/tall-buddha-statue-in-andhra-pradesh-state-amaravathi-india.jpg?s=612x612&w=0&k=20&c=3R939IZv0lNRZSTOCXB4KLvrFJgzJG08bjdC2M-gBy8=",
        attractions: [
            { name: "Tirupati Balaji Temple", price: 300, imagePath: "https://wallpapercave.com/wp/wp5991421.jpg" },
            { name: "Araku Valley", price: 800, imagePath: "https://media.istockphoto.com/id/1351964928/photo/araku-valley-visakhapatnam-andhra-pradesh-india.jpg?s=612x612&w=0&k=20&c=Mev1sG0qcWTCqzhoOaoALYrQFZnVHhqDif7CF4xfEhE=" },
            { name: "Borra Caves", price: 600, imagePath: "https://t3.ftcdn.net/jpg/03/01/55/04/360_F_301550449_4mG72VE1f2nNEQLmlCABPoAuvW9m38Ty.jpg" },
            { name: "RK Beach (Visakhapatnam)", price: 200, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4-QZ27onHQSLjcKVgjOqoFEkJuVsZMix0iw&s" },
            { name: "Amaravati Buddhist Monuments", price: 250, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/Dhyana%20Buddha%20Statue-%20Amaravati-Vijayawada-Andhra%20Pradesh-hero-hs?qlt=82&ts=1726743646729" },
            { name: "Srisailam", price: 400, imagePath: "https://i.pinimg.com/564x/c7/f5/18/c7f518ca8bec6f5c6d1a4f8d42b219a9.jpg" }
        ],
    },
    "Arunachal Pradesh": {
        description: "A Himalayan state with lush valleys, tribal culture and mountain views.",
        imageQuery: "Arunachal Pradesh landscape",
        imagePath: "https://media.istockphoto.com/id/910430170/photo/tawang-arunachal-pradesh.jpg?s=612x612&w=0&k=20&c=MKKYsHH_6JRMYROO2bHIsQAW9XoSnl-9nkRGOFgAg0M=",
        attractions: [
            { name: "Tawang Monastery", price: 350, imagePath: "https://media.istockphoto.com/id/484711920/photo/tawang-monastery-arunachal-pradesh.jpg?s=612x612&w=0&k=20&c=s0ic_pkK28PnX02apET6tprFiY3vvECUPKre7Gjjt5U=" },
            { name: "Ziro Valley", price: 700, imagePath: "https://media.istockphoto.com/id/1177028086/photo/one-of-the-most-mesmerizing-beauty-of-ziro-valley.jpg?s=612x612&w=0&k=20&c=0OO92ebZx0Q0T0u1mkvRsmxtscVtYFU_GkFB9cnX_nc=" },
            { name: "Namdapha National Park", price: 900, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmENcGj_RR06Z-Y2PNVp_stFPpZurW-VdPg&s" },
            { name: "Sela Pass", price: 300, imagePath: "https://media.istockphoto.com/id/458127421/photo/sela-pass-district-of-tawang-arunachal-pradesh-india.jpg?s=612x612&w=0&k=20&c=yBg1BRI6_QzIUIDukD6NS_EMfIDG7773UD0pWG8eEOQ=" },
            { name: "Dirang", price: 250, imagePath: "https://media.istockphoto.com/id/166744932/photo/dirang-town-kameng-river-western-arunachal-pradesh-india.jpg?s=612x612&w=0&k=20&c=dY5oSND4EVfUY2lOfqIlw9538lMa6VEwo_EL6IvQMDs=" },
            { name: "Bomdila", price: 300, imagePath: "https://t4.ftcdn.net/jpg/04/67/66/12/360_F_467661266_5Wj7Yy2i0wQ1x92v6N7g0QfWwO6Mv1Hk.jpg" }
        ],
    },
    Assam: {
        description: "Northeastern state known for tea gardens, wildlife and the Brahmaputra River.",
        imageQuery: "Assam tea garden",
        imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8QL7RO-1SaIVs13T0Z6CueGljNWavqt3S5A&s",
        attractions: [
            { name: "Kaziranga National Park", price: 1200, imagePath: "https://media.istockphoto.com/id/1227079384/photo/sunset-in-the-wild.jpg?s=612x612&w=0&k=20&c=wvV0klvkkZiF6ybOVQR-vJu74NJ-hgimUPOhG2Fi2l8=" },
            { name: "Majuli Island", price: 500, imagePath: "https://media.istockphoto.com/id/1219436845/photo/beautiful-scenery-of-majuli-island-assam.jpg?s=612x612&w=0&k=20&c=wOF4KQPUZOKSs8nuE4MDGwKL3PkIA-9GxWdALjJL6ns=" },
            { name: "Kamakhya Temple", price: 150, imagePath: "https://media.istockphoto.com/id/1502218452/photo/sacred-hindu-shrine-in-assam-india-kamakhya-temple-sacred-place-of-worship-in-india.jpg?s=612x612&w=0&k=20&c=BqhgvOEEK5QXl_YG4sVNWcKdG-NkY-HC4l-h4dNitAE=" },
            { name: "Hajo", price: 200, imagePath: "https://media.gettyimages.com/id/534382772/photo/hajo-guwahati-assam-india-devotees-at-a-temple-in-hajo-hajo-is-an-ancient-pilgrimage-centre.jpg?s=612x612&w=gi&k=20&c=7WNtRCgZAAxRwOtl2rZF45kxbsEwvdB-fhEf--5UD3Q=" },
            { name: "Sivasagar", price: 250, imagePath: "https://t4.ftcdn.net/jpg/02/90/27/27/360_F_290272723_RkvodvkuuaLEvpbCdLYy8AHf0c4IQuvi.jpg" },
            { name: "Manas National Park", price: 1100, imagePath: "https://i0.wp.com/currylines.com/wp-content/uploads/2018/12/IMG_20181211_104401.jpg?fit=1920%2C1080&ssl=1" }
        ],
    },
    Bihar: {
        description: "An eastern state with rich historical sites and Buddhist heritage.",
        imageQuery: "Bihar heritage site",
        imagePath: "https://media.istockphoto.com/id/530927704/photo/mahabodhi-temple-bodhgaya.jpg?s=612x612&w=0&k=20&c=MeuSoIquuLhsQB5JNv3zDn8G6IPuNRlbcIW9EZd4o3o=",
        attractions: [
            { name: "Bodh Gaya", price: 200, imagePath: "https://media.istockphoto.com/id/1129899392/photo/big-statue-of-buddha-bodh-gaya-india-famous-buddhist-place-of-interest.jpg?s=612x612&w=0&k=20&c=CMr9OhGrBlvmAXZFgKlQsJ3XihxOdSDorkic7_zA0Nk=" },
            { name: "Nalanda University ruins", price: 300, imagePath: "https://media.istockphoto.com/id/505519489/photo/nalanda-university-bihar-ruin.jpg?s=612x612&w=0&k=20&c=wzg_b8wzmX393rMWd5Hyc5Hqvn3iQldWen-zY_55Pu4=" },
            { name: "Vaishali", price: 180, imagePath: "https://media.istockphoto.com/id/1365993607/photo/ashoka-pillar-at-vaishali-in-bihar-india.jpg?s=612x612&w=0&k=20&c=E1VlOJI-ch4LduZy1xGLIHkqZcN1KcZiTt6hPn3T228=" },
            { name: "Rajgir", price: 220, imagePath: "https://t3.ftcdn.net/jpg/12/69/33/84/360_F_1269338484_rSWSGdcUuVFBMESGrOa51wjbzrnKsfyM.jpg" },
            { name: "Patna Sahib Gurudwara", price: 150, imagePath: "https://media.istockphoto.com/id/1323304834/photo/takhat-sri-harimandir-ji-gurdwara-also-known-as-patna-sahib.jpg?s=612x612&w=0&k=20&c=iJf9ONGvtsLQHEMpALpkhLQw0ts51Y8scTr_RYQ10BE=" },
            { name: "Sonepur Mela", price: 400, imagePath: "https://img.traveltriangle.com/blog/wp-content/uploads/2020/04/cover-for-Sonepur-Mela_15th-Apr.jpg" }
        ],
    },
    "Chhattisgarh": {
        description: "Central Indian state known for forests, waterfalls and tribal traditions.",
        imageQuery: "Chhattisgarh waterfall",
        imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVo2jHgQmJdq_o4QLWn09kt02V0E6FNiqixQ&s",
        attractions: [
            { name: "Chitrakote Falls", price: 350, imagePath: "https://content.jdmagicbox.com/comp/bastar/v8/9999p7782.7782.171205221345.a4v8/catalogue/chitrakote-falls-bastar-iiv6wsamd4.jpg" },
            { name: "Barnawapara Wildlife Sanctuary", price: 800, imagePath: "https://www.chhattisgarhtourism.co.in/photo_gallery/barnawapara_wildlife_sanctuary/05.jpg" },
            { name: "Bastar", price: 300, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtXUo5UDhkBKRxuuP0hPniSnMHRQjxCvJM2w&s" },
            { name: "Kanger Valley National Park", price: 700, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd0hJtH1E2hCap2551lVZlHL0rQmOJvFymkQ&s" },
            { name: "Sirpur", price: 200, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgJu5tJ4uAEgl9pxNltY92Je8sPVx_Vijsrw&s" },
            { name: "Danteshwari Temple", price: 150, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSujYFQnMCy7k3-mdXvThPhKpESaMtQt-IVQ&s://t3.ftcdn.net/jpg/03/92/79/64/360_F_392796417_7dE2FwJ680W2W42Ym7P0c4Bf91C3Yk8j.jpg" }
        ],
    },
    Goa: {
        description: "A small coastal state famous for beaches, seafood and Portuguese heritage.",
        imageQuery: "Goa beach",
        imagePath: "https://cdn.wallpapersafari.com/25/43/shVYSl.jpg",
        attractions: [
            { name: "Baga Beach", price: 300, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEoMxtfOlDn5NuCCuq0ErySVIxK0szrS6-Ig&s://t3.ftcdn.net/jpg/03/85/08/90/360_F_385089060_e7rT6U67y0J1Yd31Lz0i9pU0b4Wf98L5.jpg" },
            { name: "Old Goa Basilica", price: 150, imagePath: "https://media.istockphoto.com/id/1215072617/photo/basilica-de-bom-jesus-old-goa-india.jpg?s=612x612&w=0&k=20&c=PRdLWUCVscFY1PEnNGDuk2ebaCcuma6EQn5cT92hsdQ=" },
            { name: "Dudhsagar Falls", price: 400, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOomd9Fqlj6dREyxRO9hbr1oRpdKmo0DtbtQ&shttps://i.ytimg.com/vi/G62-bASJjVE/maxresdefault.jpghttps://i.ytimg.com/vi/G62-bASJjVE/maxresdefault.jpg" },
            { name: "Calangute Beach", price: 250, imagePath: "https://i.ytimg.com/vi/G62-bASJjVE/maxresdefault.jpg" },
            { name: "Fort Aguada", price: 200, imagePath: "https://www.fabhotels.com/blog/wp-content/uploads/2019/06/Aguada-Fort_600.jpg" },
            { name: "Palolem Beach", price: 300, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGTew41lYr7HtVti0ityiUxm_1H2UgKlO2TA&s" }
        ],
    },
    Gujarat: {
        description: "Western state known for vibrant culture, handicrafts and the Rann of Kutch.",
        imageQuery: "Gujarat landscape",
        imagePath: "https://t4.ftcdn.net/jpg/03/07/02/89/360_F_307028960_hWFgcjCThe45DNGQnYVbJvcIbDutlUOJ.jpg",
        attractions: [
            { name: "Rann of Kutch", price: 600, imagePath: "https://www.tripsavvy.com/thmb/Yh7C0nh6CKbB5BmhRz3il-V8sm8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-537000923-541774dbe2d44759815fdf0719b04685.jpg" },
            { name: "Gir National Park", price: 1000, imagePath: "https://www.tripsavvy.com/thmb/ldxtGQ7kKuG89A1ul5-zw8cBvhk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1081266451-5ab50c7f8023b90036495226.jpg" },
            { name: "Somnath Temple", price: 200, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrczX3-TbMThaVK0n3v9UKB7jJqDiecJ6bJw&s" },
            { name: "Sabarmati Ashram", price: 150, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6vZhVt77-o6JsZsSH_bFuZSvAxPo7wGbWjg&s" },
            { name: "Dwarka", price: 300, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8uyThgqoPKbn04bqxDe5OSxrvsArsGFRsuw&sps://t3.ftcdn.net/jpg/04/85/65/69/360_F_485656923_47W63u0Jt5j4rPz01w7v0xXjC0l7r6eP.jpg" },
            { name: "Modhera Sun Temple", price: 180, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/41/a6/92/sun-temple-and-tank.jpg?w=900&h=500&s=1" }
        ],
    },
    Haryana: {
        description: "A north Indian state surrounding Delhi, with historic sites and agriculture.",
        imageQuery: "Haryana city",
        imagePath: "https://t3.ftcdn.net/jpg/02/13/91/24/360_F_213912437_0UH7CTZWyyyytON45X8CBP6sxtA8mlWd.jpg",
        attractions: [
            { name: "Kurukshetra", price: 120, imagePath: "https://static.toiimg.com/thumb/msid-72244019,width-550,height-433/72244019.jpg" },
            { name: "Sultanpur National Park", price: 200, imagePath: "https://res.cloudinary.com/roundglass/image/upload/f_auto/q_auto/f_auto/c_limit,w_auto:breakpoints_200_2560_100_5:1265/v1657211646/rg/collective/media/haryana-sultanpur-blue-bull-nilgai-male-one-bhavya-iyer-1657211646269.jpg" },
            { name: "Pinjore Gardens", price: 150, imagePath: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSw6iiHKj_KB57VhTgnl6utAywHu9Dem5rbGLSz9b0drVGw7jYOZvRbTN97cAMoc19oXvg9Ucwl8B_QabjszkpeQtGM75Km94ocfEE6F9VdTteJpmHZx61nOC5b3tcDFIrxYXE1M_g=s680-w680-h510-rw" },
            { name: "Panipat", price: 100, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzsvxJZBpYpsCUtjc0NEmG024oxPCZLiRoLg&s" },
            { name: "Brahma Sarovar", price: 80, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/c6/54/4c/brahma-sarovar.jpg?w=1200&h=-1&s=1" }, // Placeholder similar to a holy water body
            { name: "Pehowa", price: 90, imagePath: "https://im.hunt.in/cg/Har/Pehowa/City-Guide/pot.jpg" } // General temple/town placeholder
        ],
    },
    "Himachal Pradesh": {
        description: "A Himalayan state popular for hill stations, trekking and mountain scenery.",
        imageQuery: "Himachal Pradesh mountains",
        imagePath: "https://t4.ftcdn.net/jpg/04/70/76/19/360_F_470761995_6ru1SxTV2KCienxwZ5H2U8gZrqJH0fiI.jpg",
        attractions: [
            { name: "Shimla", price: 400, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZPBCvd1hRcHh8uhNvcbA7_OZSse_2I23Teg&s" },
            { name: "Manali", price: 450, imagePath: "https://www.mytownblog.com/wp-content/uploads/2024/10/Best-Places-to-Visit-in-Manali.png" },
            { name: "Dharamshala", price: 350, imagePath: "https://c.ndtvimg.com/gws/ms/top-places-to-visit-in-dharamshala/assets/11.jpeg?1765125887" },
            { name: "Spiti Valley", price: 1200, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/d8/62/4c/dhankar-lake.jpg?w=1200&h=-1&s=1" },
            { name: "Kullu", price: 300, imagePath: "https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2021/01/Kullu-Best-Places-to-Visit.jpg?fit=1024%2C630&ssl=1" },
            { name: "Kasol", price: 220, imagePath: "https://c.ndtvimg.com/2025-04/3btm44cg_kasol_625x300_23_April_25.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=738" }
        ],
    },
    Jharkhand: {
        description: "A state with forests, waterfalls and mineral resources.",
        imageQuery: "Jharkhand waterfall",
        imagePath: "https://images.unsplash.com/photo-1625387891389-a4b440ae958e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amhhcmtoYW5kfGVufDB8fDB8fHww",
        attractions: [
            { name: "Betla National Park", price: 700, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgV2t3uN_YMHzBME8eKB5LH5kKKRnG1hwZIQ&s" }, // Placeholder for a forest/wildlife image
            { name: "Dassam Falls", price: 200, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Dassam_falls.jpg/1200px-Dassam_falls.jpg" },
            { name: "Ranchi Rock Garden", price: 120, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/3d/c0/e5/rock-garden.jpg?w=900&h=500&s=1" }, // General garden/park placeholder
            { name: "Deoghar", price: 180, imagePath: "https://upload.wikimedia.org/wikipedia/commons/9/90/Baba_Baidyanath_Jyotirlinga_Temple.jpg" }, // General temple town placeholder
            { name: "Hazaribagh National Park", price: 600, imagePath: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUlzcWQIRTs0oOC_YmmAkAz_-54IudtHHBnk-mRlcpqzmQ8V3kRHGRPL4MsglH4BocCJgw2PwFJH9OAB0eCCHsgDHPszLnsELi-Xhl7qNF1mqnybJZVzWgF_lqvcwN1WcT_dU3tZeEUMDBsXDKq_gG34SXUHGY7H3sE418Z9LYJIuWVxMhowA6PO6t3lnW/s1280/Hazaribagh%20Wildlife%20Sanctuary.jpg" }, // Forest placeholderhttps
            { name: "Jonha Falls", price: 150, imagePath: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyPyIH7dkZDrNPyPf4BmSc0oA5FbNnuYvcWki0dqkzBV0IomqCcbCwXLM75jL50-fVKknmfkcXjiLxUI1RKHZ_ahw58hGJgDL_Ynb_F9PNwKaemAVARbxkWWSAXXMDTm3ks9gtr=s680-w680-h510-rw" } // Waterfall placeholder
        ],
    },
    Karnataka: {
        description: "A tech and cultural hub with beaches, historic sites and rich cuisine.",
        imageQuery: "Karnataka Bangalore",
        imagePath: "https://t4.ftcdn.net/jpg/02/35/12/33/360_F_235123319_9yFsyUWV6JxnQODMC8l0JQKUxnIGevdd.jpg",
        attractions: [
            { name: "Hampi", price: 500, imagePath: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2025/02/12133950/Hampi-places-to-visit-FI-1600x900.jpg" },
            { name: "Mysore Palace", price: 250, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt_Nmy020VYISuB2cz85iwbIcmCt3cyLOKBQ&s" },
            { name: "Coorg", price: 600, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmFQHvjZM2gxxDEBZU3ntJIzryHjyXXZxU1A&s" },
            { name: "Gokarna", price: 200, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/murudeshwar-temple-gokarna1-attr-hero?qlt=82&ts=1726720950541" },
            { name: "Badami", price: 220, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/4f/35/d6/bhuthanatha-temple.jpg?w=1200&h=1200&s=1" },
            { name: "Bandipur National Park", price: 900, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/7c/47/ec/tiger-26-largejpg.jpg?w=900&h=500&s=1     " }
        ],
    },
    Kerala: {
        description: "A southwestern coastal state known for backwaters, spices and lush greenery.",
        imageQuery: "Kerala backwaters",
        imagePath: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2VyYWxhfGVufDB8fDB8fHww",
        attractions: [
            { name: "Alleppey backwaters", price: 700, imagePath: "https://t4.ftcdn.net/jpg/02/35/12/33/360_F_235123319_9yFsyUWV6JxnQODMC8l0JQKUxnIGevdd.jpg" },
            { name: "Munnar", price: 450, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/db/d3/f9/munnar-largejpg.jpg?w=1200&h=-1&s=1" },
            { name: "Kovalam Beach", price: 200, imagePath: "https://majesticjourney.in/wp-content/uploads/2020/05/kovalam-beach.jpg" },
            { name: "Fort Kochi", price: 150, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG9J4oDC4e_cgztnaoNTVLnQbjkKr2XBJnFQ&s" },
            { name: "Thekkady", price: 550, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT45xDNv38mD3e0SM7meZOCHSOR9-unbkPRCw&s" },
            { name: "Varkala", price: 250, imagePath: "https://www.varkkala.com/uploads/menuboxes/561134427.webp" }
        ],
    },
    "Madhya Pradesh": {
        description: "A central state with wildlife reserves, temples and historic cities.",
        imageQuery: "Khajuraho Temples India",
        imagePath: "https://t4.ftcdn.net/jpg/02/85/43/37/360_F_285433744_iUcC83UYSfOuJjtXIiWiUbjWezGWlTbJ.jpg", // Khajuraho Western Group of Temples
        attractions: [
            { name: "Khajuraho Temples", price: 300, imagePath: "https://t4.ftcdn.net/jpg/02/85/43/37/360_F_285433744_iUcC83UYSfOuJjtXIiWiUbjWezGWlTbJ.jpg" },
            { name: "Bandhavgarh National Park", price: 1000, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/2c/31/61/pugdundee-safaris-tree.jpg?w=900&h=500&s=1" },
            { name: "Sanchi Stupa", price: 150, imagePath: "https://cdn.britannica.com/36/155836-050-89E7AA9E/Great-Stupa-Sanchi-India.jpg" },
            { name: "Pench National Park", price: 800, imagePath: "https://www.pugdundeesafaris.com/blog/wp-content/uploads/2016/12/Park-1024x595.jpg" },
            { name: "Orchha", price: 200, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/1d/24/96/the-marvellous-orchha.jpg?w=1200&h=-1&s=1" },
            { name: "Bhimbetka Rock Shelters", price: 180, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5MHpTTQl-Qac17Rmbu6NphDsQiuSgixFdVA&s" }
        ],
    },
    "Maharashtra": {
        description: "A large western state home to Mumbai, forts and diverse cultures.",
        imageQuery: "Gateway of India Mumbai",
        imagePath: "https://t4.ftcdn.net/jpg/03/62/77/97/360_F_362779728_ampDb4eXDhaplRu2DEoR6yQC7SisGpEg.jpg", // Gateway of India
        attractions: [
            { name: "Gateway of India (Mumbai)", price: 250, imagePath: "https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Gateway-Of-India_600-1.jpg" },
            { name: "Ajanta & Ellora Caves", price: 800, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0a6eNoRtMVO18H4os0ugvR_WSO-Snibtu-A&s" },
            { name: "Mahabaleshwar", price: 300, imagePath: "https://www.fabhotels.com/blog/wp-content/uploads/2019/04/Things-to-do-in-Mahabaleshwar_600x400.jpg" },
            { name: "Lonavala", price: 220, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFz11e3Y09_BKEHo2ttsebWXa39EGeS3zzw&s" },
            { name: "Pune (Aga Khan Palace)", price: 180, imagePath: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/ac/cb/70/the-palace.jpg?w=1200&h=-1&s=1" },
            { name: "Elephanta Caves", price: 200, imagePath: "https://www.fabhotels.com/blog/wp-content/uploads/2018/08/600x400-35.jpg" }
        ],
    },
    "Manipur": {
        description: "A northeastern state known for its dance, lakes and ethnic diversity.",
        imageQuery: "Loktak Lake Manipur",
        imagePath: "https://images.unsplash.com/photo-1587635861480-414767bd0198?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuaXB1cnxlbnwwfHwwfHx8MA%3D%3D", // Loktak Lake with Phumdis
        attractions: [
            { name: "Loktak Lake", price: 250, imagePath: "https://i.pinimg.com/736x/cb/2a/46/cb2a46e59f55f25d1917e1ebc12f734c.jpg" },
            { name: "Imphal War Cemetery", price: 100, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/imphal-war-cemetery-imphal-manipur-1-attr-hero?qlt=82&ts=1742155907878" },
            { name: "Khonghampat Orchidarium", price: 120, imagePath: "https://stylesatlife.com/wp-content/uploads/2018/05/Khonghampat-Orchidarium.jpg" },
            { name: "Shirui Kashong Peak", price: 400, imagePath: "https://www.tourmyindia.com/states/manipur/images/shirui-kashung-peak1.jpeg" },
            { name: "Keibul Lamjao National Park", price: 600, imagePath: "https://www.shutterstock.com/image-photo/floating-national-park-india-keibul-260nw-1392725705.jpg" },
            { name: "Kangla Fort", price: 80, imagePath: "https://thumbs.dreamstime.com/b/kangla-fort-old-fortified-palace-imphal-manipur-state-india-was-formerly-situated-both-sides-bank-river-318524174.jpg" }
        ],
    },
    "Meghalaya": {
        description: "Known for living root bridges, high rainfall and scenic hills.",
        imageQuery: "Living Root Bridge Meghalaya",
        imagePath: "https://images.unsplash.com/photo-1609276804051-8c5e906cc430?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZ2hhbGF5YXxlbnwwfHwwfHx8MA%3D%3D", // Nongriat Double Decker Root Bridge
        attractions: [
            { name: "Living Root Bridges", price: 350, imagePath: "https://www.shutterstock.com/image-photo/living-root-bridges-meghalaya-double-600nw-634408664.jpg" },
            { name: "Shillong", price: 220, imagePath: "https://t3.ftcdn.net/jpg/04/87/00/26/360_F_487002667_Ksmrc5Lvvyvc4gkpRUYQtsHRLn2usdS5.jpg" },
            { name: "Cherrapunji", price: 200, imagePath: "https://t4.ftcdn.net/jpg/08/44/32/71/360_F_844327134_BizEwb4eQIwlg6IKeeBbvD3YcjlLpuCB.jpg" },
            { name: "Mawlynnong", price: 150, imagePath: "https://thumbs.dreamstime.com/b/clean-pathway-mawlynnong-village-meghalaya-north-east-india-clean-pathway-mawlynnong-village-meghalaya-north-east-india-124327829.jpg" },
            { name: "Nongriat", price: 300, imagePath: "https://t4.ftcdn.net/jpg/03/42/86/85/360_F_342868539_IbMReH5rkoPZvDJfRlPrCvscaDNDFpBN.jpg" },
            { name: "Dawki", price: 180, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnkCom2YbGaFamQtGMn83PZ_dsvxnNKnZag&s" }
        ],
    },
    "Mizoram": {
        description: "A hilly northeastern state with tribal cultures and forested landscapes.",
        imageQuery: "Mizoram hills",
        imagePath: "https://media.istockphoto.com/id/1323055401/photo/view-of-aizwal-city-just-before-the-sunset.jpg?s=612x612&w=0&k=20&c=mOn6mPwP8pse6IBgV_ssgii3jyTNFOlBFyW_fIa93RM=", // View of Aizawl District
        attractions: [
            { name: "Aizawl", price: 200, imagePath: "https://t4.ftcdn.net/jpg/12/91/17/69/360_F_1291176923_zB8rDed7mqnpB7ppVLCfveWwJp0mA4aG.jpg" },
            { name: "Vantawng Falls", price: 180, imagePath: "https://cdn.s3waas.gov.in/s36766aa2750c19aad2fa1b32f36ed4aee/uploads/bfi_thumb/2018081697-olw8z0svast2qbduijnqbw1gc2b4p4jezlkc1cbg5m.jpg" },
            { name: "Dampa Tiger Reserve", price: 700, imagePath: "https://static.toiimg.com/img/91442093/Master.jpg" },
            { name: "Phawngpui (Blue Mountain)", price: 450, imagePath: "https://cdn1.tripoto.com/media/filter/nl/img/2380291/Image/1700043146_reiek_mountain.jpg.webp" },
            { name: "Reiek", price: 150, imagePath: "https://thumbs.dreamstime.com/b/green-rock-hills-nature-202731068.jpg" },
            { name: "Khawzawl Falls", price: 120, imagePath: "https://mizoramtourism.com/post_images/62addcb8029f6_Khawhpawp,%20Amah%20Duhtea,%20Liker-8.jpg" }
        ],
    },
    "Nagaland": {
        description: "A northeastern state celebrated for festivals, crafts and mountains.",
        imageQuery: "Hornbill Festival Nagaland",
        imagePath: "https://t4.ftcdn.net/jpg/10/84/29/49/360_F_1084294904_WEE7gdXZsA5BTMDs9UCFNEMEjgk4iWwP.jpg", // Hornbill Festival Performance
        attractions: [
            { name: "Hornbill Festival", price: 500, imagePath: "https://upload.wikimedia.org/wikipedia/commons/4/47/Hornbill_Festival.jpg" },
            { name: "Kohima War Cemetery", price: 100, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/kohima-war-cemetery-kohima-nagaland-1-attr-hero?qlt=82&ts=1727012356754" },
            { name: "Dzükou Valley", price: 300, imagePath: "https://www.twobirdsbreakingfree.com/files/IMG_6553.jpg" },
            { name: "Mon", price: 200, imagePath: "https://cdn.s3waas.gov.in/s368264bdb65b97eeae6788aa3348e553c/uploads/bfi_thumb/2018041978-1024x588-olw932hnlkgwf92q19uffrbpkkdor5ci77evuinf1a.jpg" },
            { name: "Naga Heritage Village", price: 180, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/naga-heritage-village-kohima-nagaland-1-attr-hero?qlt=82&ts=1727012342520" },
            { name: "Mokokchung", price: 150, imagePath: "https://cdn1.tripoto.com/media/filter/nl/img/2380291/Image/1702109439_36668999925_59821f3caf_b.jpg.webp" }
        ],
    },
    "Odisha": {
        description: "An eastern coastal state with temples, beaches and classical art.",
        imageQuery: "Konark Sun Temple",
        imagePath: "https://t4.ftcdn.net/jpg/03/57/08/67/360_F_357086731_jBle2OWqP91IYg4fdKTvaihGIUzFOsXy.jpg", // Konark Sun Temple
        attractions: [
            { name: "Konark Sun Temple", price: 180, imagePath: "https://t4.ftcdn.net/jpg/03/57/08/67/360_F_357086731_jBle2OWqP91IYg4fdKTvaihGIUzFOsXy.jpg" },
            { name: "Puri", price: 220, imagePath: "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVyaSUyMG9kaXNoYXxlbnwwfHwwfHx8MA%3D%3D" }, // Jagannath Temple placeholder
            { name: "Chilika Lake", price: 400, imagePath: "https://www.shutterstock.com/image-photo/chilika-lagoon-lake-odisha-india-600nw-2317265607.jpg" },
            { name: "Dhauli", price: 120, imagePath: "https://t3.ftcdn.net/jpg/00/52/84/14/360_F_52841479_YdxG4UCjhfSLQfp5ieeMX2T4WxHZHxNg.jpg" },
            { name: "Bhitarkanika National Park", price: 700, imagePath: "https://odishatourism.gov.in/content/dam/tourism/home/discover/attractions/forest-and-wildlife/bhitarkanika-nature-camps/gallery/2.jpg" },
            { name: "Lingaraja Temple", price: 150, imagePath: "https://thumbs.dreamstime.com/b/dec-oldest-stone-lingaraj-shiva-temple-bhubaneswar-orissa-india-172632794.jpg" }
        ],
    },
    "Punjab": {
        description: "A northwestern state famed for its Punjabi culture, food and fields.",
        imageQuery: "Golden Temple Amritsar",
        imagePath: "https://plus.unsplash.com/premium_photo-1697730331435-92e07494db43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVuamFiJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D", // Golden Temple (Harmandir Sahib)
        attractions: [
            { name: "Golden Temple (Amritsar)", price: 0, imagePath: "https://plus.unsplash.com/premium_photo-1697730331435-92e07494db43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVuamFiJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D" },
            { name: "Wagah Border", price: 100, imagePath: "https://thumbs.dreamstime.com/b/wagah-border-pakistan-india-border-lahore-pakistan-february-x-everyday-pm-ceremony-held-where-pakistani-indian-91225026.jpg" }, // Monument/Gate placeholder
            { name: "Anandpur Sahib", price: 80, imagePath: "https://as1.ftcdn.net/v2/jpg/03/15/09/84/1000_F_315098427_tvog2nt5iQvGNdtUJpHecIfWU15GyPKi.jpg" },
            { name: "Jallianwala Bagh", price: 50, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/jallianwala-bagh-amritsar-punjab-1-attr-hero?qlt=82&ts=1726662275638" },
            { name: "Patiala", price: 120, imagePath: "https://w0.peakpx.com/wallpaper/197/859/HD-wallpaper-dukhniwaran-sahib-g-architecture-dukhniwaran-sahib-gurdwara-sahib-patiala-guru-ghar-guru-ghar-patiala-gurudwara-sahib-patiala-religious-royal-city-sikh-religion.jpg" }, // City/Palace placeholder
            { name: "Bathinda Fort", price: 90, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIBWJJZPNRorNmVY5tMXJ3yFo0zFKRlKgs8w&s" }
        ],
    },
    "Rajasthan": {
        description: "A desert state with palaces, forts and vibrant folk traditions.",
        imageQuery: "Amer Fort Jaipur",
        imagePath: "https://t3.ftcdn.net/jpg/02/56/53/38/360_F_256533834_Chxhh4CkOk6YVnvAKGPSN3jc40rSTFaV.jpg", // Amer Fort
        attractions: [
            { name: "Jaipur City Palace", price: 250, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAKyz2jubRc5OqvvsDlosQPIdtqd75V5ZBQQ&s" },
            { name: "Jaisalmer Fort", price: 200, imagePath: "https://t4.ftcdn.net/jpg/02/88/10/51/360_F_288105149_rleDz7UQkzXzNwYBzMdd1GrGjCvcni3U.jpg" },
            { name: "Udaipur Lake Pichola", price: 300, imagePath: "https://media.istockphoto.com/id/1343698822/photo/udaipur-city-palace-beside-beautiful-lake-pichola-at-udaipur-rajasthan-india.jpg?s=612x612&w=0&k=20&c=i2Xvwz1tUVGEr3FKLam3jxNiyUSGEZ6e79zDSpoI96M=" },
            { name: "Pushkar", price: 180, imagePath: "https://plus.unsplash.com/premium_photo-1697730426227-9056296a0315?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHB1c2hrYXJ8ZW58MHx8MHx8fDA%3D" },
            { name: "Jodhpur", price: 220, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIvm02MlzgLUHza1C-svt6eLy-cu1mP106fA&s" },
            { name: "Bikaner", price: 200, imagePath: "https://media.istockphoto.com/id/178994126/photo/cityscape-of-bikaner-old-indian-city-in-rajasthan.jpg?s=612x612&w=0&k=20&c=Y6-IQTbQ1IJ90zjvoHVG_8qGKDG8jKbnHPQW56EmCeY=" }
        ],
    },
    "Sikkim": {
        description: "A small Himalayan state known for monasteries, trekking and mountain vistas.",
        imageQuery: "Kanchenjunga Sikkim",
        imagePath: "https://t3.ftcdn.net/jpg/01/21/23/68/360_F_121236833_qW55yETyBDXcwPL3ZPioUt4uVd0DkYaQ.jpg", // Kanchenjunga from Pelling
        attractions: [
            { name: "Gangtok", price: 300, imagePath: "https://media.istockphoto.com/id/1044402406/photo/aerial-photo-of-ropeway-cable-car-gondola-ride-over-gangtok-city-during-sunset-in-sikkim-india.jpg?s=612x612&w=0&k=20&c=zZb-JHFCyY1vvaN3jCItlf70tfJoDcGLH_e1KD7BdmE=" },
            { name: "Tsomgo Lake", price: 250, imagePath: "https://media.istockphoto.com/id/1219200332/photo/tsomgo-lake-sikkim.jpg?s=612x612&w=0&k=20&c=RId2tjM52qJOaQ857D-xqDNe_I9awAn5mx2S1ruvewY=" },
            { name: "Nathu La Pass", price: 800, imagePath: "https://t3.ftcdn.net/jpg/02/32/94/12/360_F_232941291_MBchkpSq0oWv3FX1M7FnL1t0YsTbrgP4.jpg" },
            { name: "Yuksom", price: 200, imagePath: "https://t4.ftcdn.net/jpg/02/95/55/23/360_F_295552372_glnOtBLVRjR9M7lzW0XS0NVCgQ1aGQzn.jpg" },
            { name: "Pelling", price: 220, imagePath: "https://media.istockphoto.com/id/515792454/photo/buddha-park-ravangla.jpg?s=612x612&w=0&k=20&c=6R5vX7MAdFUdSIhH4zTbTxub2JEc6fak880ardwWNaE=" },
            { name: "Lachung", price: 260, imagePath: "https://t4.ftcdn.net/jpg/03/43/79/39/360_F_343793910_xiIWQPXN9p4QFbV9b0rLJCIYVgQ0cP7Q.jpg" }
        ],
    },
    "Tamil Nadu": {
        description: "A southern state with Dravidian temples, classical arts and coastline.",
        imageQuery: "Meenakshi Temple Madurai",
        imagePath: "https://t4.ftcdn.net/jpg/08/66/31/19/360_F_866311958_LP9Ow0f9xAZu5MjXmwaKp21BNPs3lYfQ.jpg", // Meenakshi Temple Madurai
        attractions: [
            { name: "Meenakshi Temple (Madurai)", price: 100, imagePath: "https://t4.ftcdn.net/jpg/08/66/31/19/360_F_866311958_LP9Ow0f9xAZu5MjXmwaKp21BNPs3lYfQ.jpg" },
            { name: "Mahabalipuram", price: 200, imagePath: "https://media.istockphoto.com/id/471507884/photo/shore-temple-mamallapuram.jpg?s=612x612&w=0&k=20&c=QvX3e5SD4jPlznA6FBPSLm-_9fYbsf6KO94Bai-hKSU=" },
            { name: "Ooty", price: 400, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_RSzqo6uCl8MidARyQ2Xrgd0YhZj0ASq4Q&s" },
            { name: "Kanyakumari", price: 220, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToxTLHkG9sozy-Y3Mjv7rAZUhyoGApgVNf3w&s" },
            { name: "Kodaikanal", price: 300, imagePath: "https://media.istockphoto.com/id/1175506409/photo/small-village-amidst-terrace-farms-on-hills-of-kodaikanal-tamil-nadu.jpg?s=612x612&w=0&k=20&c=E_SZ5ejTB3kuHej2RMX6HAWq26V3n0Jyfx4nSxs5rUY=" },
            { name: "Rameswaram", price: 180, imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuAfusKOlwwuvWTB7qTNdiYJ36sOSfPfI-yw&s" }
        ],
    },
    "Telangana": {
        description: "A southern state with a mix of IT hubs, historic sites and cuisine.",
        imageQuery: "Charminar Hyderabad",
        imagePath: "https://t4.ftcdn.net/jpg/00/75/88/51/360_F_75885169_s7OiM32ZmQOajC08cTQcGTsgv6ndTyIC.jpg", // Charminar Hyderabad
        attractions: [
            { name: "Charminar (Hyderabad)", price: 80, imagePath: "https://t4.ftcdn.net/jpg/00/75/88/51/360_F_75885169_s7OiM32ZmQOajC08cTQcGTsgv6ndTyIC.jpg" },
            { name: "Golconda Fort", price: 150, imagePath: "https://media.istockphoto.com/id/463182269/photo/old-ruins-surrounded-by-grass-and-small-trees.jpg?s=612x612&w=0&k=20&c=XWSaTbCUGQBdLKLtF8yUIbat4yLwWwfCSkeq8S5E-SI=" },
            { name: "Ramoji Film City", price: 1200, imagePath: "https://www.shutterstock.com/image-photo/hyderabad-telangana-india-july-20-260nw-2280780447.jpg" }, // General park/city placeholder
            { name: "Hussain Sagar", price: 100, imagePath: "https://www.shutterstock.com/image-photo/buddha-statue-hussain-sagar-lake-260nw-1282739056.jpg" },
            { name: "Warangal Fort", price: 200, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/warangal-fort-warangal-telangana-1-attr-hero?qlt=82&ts=1726653479730" },
            { name: "Bhadrachalam", price: 160, imagePath: "https://www.holidify.com/images/bgImages/BHADRACHALAM.jpg" }
        ],
    },
    "Tripura": {
        description: "A small northeastern state known for its palaces, temples, and natural beauty.",
        imageQuery: "Neermahal Tripura",
        imagePath: "https://w0.peakpx.com/wallpaper/644/612/HD-wallpaper-water-palace-tripura-water-neermahal-palace-lake.jpg", // Neermahal (Water Palace)
        attractions: [
            { name: "Neermahal", price: 180, imagePath: "https://w0.peakpx.com/wallpaper/644/612/HD-wallpaper-water-palace-tripura-water-neermahal-palace-lake.jpg" },
            { name: "Ujjayanta Palace", price: 150, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/ujjayanta-palace-agartala-tripura-3-attr-hero?qlt=82&ts=1726651024659" },
            { name: "Sepahijala Wildlife Sanctuary", price: 400, imagePath: "https://s7ap1.scene7.com/is/image/incredibleindia/sepahijala-wildlife-sanctuary-agartala-tripura-1-musthead-hero?qlt=82&ts=1726650974469" },
            { name: "Unakoti", price: 250, imagePath: "https://www.easeindiatrip.com/blog/wp-content/uploads/2025/06/Tripura-Unakoti-Rock-Carvings-01.jpg" },
            { name: "Agartala", price: 100, imagePath: "https://t4.ftcdn.net/jpg/05/11/69/47/360_F_511694771_IqcOhKMcNctMzdForaoukY3C9uDQVvxV.jpg" },
            { name: "Rudrasagar Lake", price: 120, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Neermahal191.jpg/1200px-Neermahal191.jpg" }
        ],
    },
    "Uttarakhand": {
        description: "A northern Himalayan state, known for pilgrimage sites and stunning mountain landscapes.",
        imageQuery: "Rishikesh and Ganga",
        imagePath: "https://media.istockphoto.com/id/473174834/photo/wallpaper-village-in-uttarakhand.jpg?s=612x612&w=0&k=20&c=S652pdfZuIsHgsL-sHKdKizkCOixLtS18VobFAsGW4A=", // Ganges River in Rishikesh
        attractions: [
            { name: "Rishikesh", price: 150, imagePath: "https://plus.unsplash.com/premium_photo-1697729439457-85d4b9d3a2cb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmlzaGlrZXNofGVufDB8fDB8fHww" },
            { name: "Haridwar", price: 100, imagePath: "https://t3.ftcdn.net/jpg/03/69/26/76/360_F_369267682_FlYwvXVosSUPvQ3yyQpc9DaRLbDGZ3of.jpg" },
            { name: "Nainital", price: 250, imagePath: "https://images.pexels.com/photos/17004229/pexels-photo-17004229/free-photo-of-boats-on-the-shore-of-the-nainital-lake-in-india.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
            { name: "Mussoorie", price: 200, imagePath: "https://images.unsplash.com/photo-1547106365-bb4b17f50a15?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzc29vcmllJTJDJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D" },
            { name: "Valley of Flowers National Park", price: 900, imagePath: "https://images.unsplash.com/photo-1600707656536-c5ace2c14c29?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFsbGV5JTIwb2YlMjBmbG93ZXJzJTIwbmF0aW9uYWwlMjBwYXJrfGVufDB8fDB8fHww" },
            { name: "Dehradun", price: 180, imagePath: "https://media.istockphoto.com/id/1140128164/photo/mussoorie-landscape-in-cloudy-rainy-monsoon-season-stock-image.jpg?s=612x612&w=0&k=20&c=j-S1rhG75D8YNwidXt_Wt3KdqWjLxeJBFViPnCcUsZ0=" }
        ],
    },
    "Uttar Pradesh": {
        description: "A northern state home to the Taj Mahal, holy cities, and historical significance.",
        imageQuery: "Taj Mahal Agra",
        imagePath: "https://images.unsplash.com/photo-1706186839147-0d708602587b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXR0YXIlMjBwcmFkZXNofGVufDB8fDB8fHww", // Taj Mahal
        attractions: [
            { name: "Taj Mahal (Agra)", price: 1300, imagePath: "https://media.istockphoto.com/id/155096944/photo/taj-mahal-sunrise.jpg?s=612x612&w=0&k=20&c=SR-5FqC8K5cMJwUbLa-UQGAvZdJ48rLrdg63bBYpsDU=" },
            { name: "Varanasi Ghats", price: 100, imagePath: "https://images.unsplash.com/photo-1706186839147-0d708602587b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXR0YXIlMjBwcmFkZXNofGVufDB8fDB8fHww" },
            { name: "Lucknow", price: 150, imagePath: "https://media.istockphoto.com/id/671326926/photo/view-to-asfi-masjid-or-asfi-mosque-from-bara-imambara-balcony-lucknow.jpg?s=612x612&w=0&k=20&c=1R-4J0CuYxtToFD3AMFG67G9g697USgafrJUbsqvWeI=" },
            { name: "Fathepur Sikri", price: 300, imagePath: "https://cdn.pixabay.com/photo/2018/01/19/17/20/india-3092868_1280.jpg" },
            { name: "Mathura", price: 80, imagePath: "https://media.istockphoto.com/id/2191663308/photo/keshi-ghat-krishna-temple-vrindavan.jpg?s=612x612&w=0&k=20&c=WDhM5SOAfrm58ZWSoTJUfN0zeCO89F-mfr2Zbp7Wi00=" },
            { name: "Sarnath", price: 120, imagePath: "https://media.istockphoto.com/id/539021864/photo/dhamekh-stupa.jpg?s=612x612&w=0&k=20&c=SkdNJcR4zCNIsBC6kDFoLpAe7y1KGC-7BlsSh1b3mWk=" }
        ],
    },
    "West Bengal": {
        description: "An eastern state known for its cultural heritage, Kolkata, and the Sunderbans.",
        imageQuery: "Victoria Memorial Kolkata",
        imagePath: "https://media.istockphoto.com/id/1164386039/photo/howrah-bridge-on-river-ganges-at-kolkata-at-twilight-with-moody-sky.jpg?s=612x612&w=0&k=20&c=CHrNWdInFSDyERdvgd0f8935hZcBQU6lbYCE4LlXqUY=", // Victoria Memorial, Kolkata
        attractions: [
            { name: "Victoria Memorial (Kolkata)", price: 200, imagePath: "https://media.istockphoto.com/id/1164616564/photo/victoria-memorial-ancient-white-marble-monument-at-kolkata-at-sunset.jpg?s=612x612&w=0&k=20&c=isr81zWNep-328aNbqq0vwty_TYiGE_FilJ5EfZ2WL0=" },
            { name: "Darjeeling", price: 350, imagePath: "https://www.shutterstock.com/image-photo/mount-kanchenjunga-over-darjeeling-city-600nw-2536112849.jpg" },
            { name: "Sunderbans National Park", price: 1100, imagePath: "https://images.unsplash.com/photo-1706459671567-43529d418cd1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VuZGFyYmFufGVufDB8fDB8fHww" },
            { name: "Howrah Bridge (Kolkata)", price: 50, imagePath: "https://media.istockphoto.com/id/1164386039/photo/howrah-bridge-on-river-ganges-at-kolkata-at-twilight-with-moody-sky.jpg?s=612x612&w=0&k=20&c=CHrNWdInFSDyERdvgd0f8935hZcBQU6lbYCE4LlXqUY=" },
            { name: "Santiniketan", price: 150, imagePath: "https://thumbs.dreamstime.com/b/udayan-building-santiniketan-uttarayan-complex-where-noble-laureate-poet-rabinndra-nath-tagore-lived-udayan-building-224527731.jpg" },
            { name: "Digha Beach", price: 120, imagePath: "https://images.unsplash.com/photo-1559671888-af88d0c275bd?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaGF8ZW58MHx8MHx8fDA%3D" }
        ],
    },
};

export default STATE_INFO;