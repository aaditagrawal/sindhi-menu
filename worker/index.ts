export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/menu" && request.method === "GET") {
      try {
        const menuData = await MENU_DATA;
        const today = new Date();
        const { weekId, weekLabel } = getWeekInfo(today);

        return new Response(JSON.stringify({
          id: weekId,
          generatedAt: new Date().toISOString(),
          source: "/sindhi-menu.json",
          foodCourt: menuData.foodCourt,
          week: weekLabel,
          menu: menuData.menu,
          extras: menuData.extras
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({
          error: "Failed to load menu",
          details: error.message,
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};

const MENU_DATA = {
  foodCourt: "Sindhi Mess",
  menu: {
    Monday: {
      day: "Monday",
      displayDate: "Sep 04",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer masala"] },
            { kind: "veg", title: "Veg", items: ["Red chana", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Butter Chicken"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer Tikka masala"] },
            { kind: "veg", title: "Veg", items: ["Rajma masala", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken masala"] }
          ]
        }
      }
    },
    Tuesday: {
      day: "Tuesday",
      displayDate: "Sep 05",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer kaju masala"] },
            { kind: "veg", title: "Veg", items: ["Lobia", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Green Chicken masala"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer Burji"] },
            { kind: "veg", title: "Veg", items: ["Chana masala", "Dal", "Puri", "Chapati", "Kheer", "Rice", "Papad"] }
          ]
        }
      }
    },
    Wednesday: {
      day: "Wednesday",
      displayDate: "Sep 06",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Soya/Gobi Manchurian"] },
            { kind: "veg", title: "Veg", items: ["Aloo Sabzi", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken Gravy"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer Tikka Kabab"] },
            { kind: "veg", title: "Veg", items: ["Veg gravy", "Soya Aloo Sabzi", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken Kabab", "Chicken gravy"] }
          ]
        }
      }
    },
    Thursday: {
      day: "Thursday",
      displayDate: "Sep 07",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer chilli"] },
            { kind: "veg", title: "Veg", items: ["Dahi Kadhi", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken chilli"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Matar Paneer masala"] },
            { kind: "veg", title: "Veg", items: ["Aloo matar", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken Masala"] }
          ]
        }
      }
    },
    Friday: {
      day: "Friday",
      displayDate: "Sep 08",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer bhurji"] },
            { kind: "veg", title: "Veg", items: ["Rajma masala", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Egg bhurji"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Paneer Kofta"] },
            { kind: "veg", title: "Veg", items: ["Black dal", "Dal", "Rice", "Chapati"] },
            { kind: "nonVeg", title: "Non Veg", items: ["Chicken Gravy"] }
          ]
        }
      }
    },
    Saturday: {
      day: "Saturday",
      displayDate: "Sep 09",
      meals: {
        lunch: {
          name: "Lunch",
          startTime: "11:30",
          endTime: "14:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Channa masala"] },
            { kind: "veg", title: "Veg", items: ["Aloo Sabzi", "Puri/Chapati", "Rice", "Dal", "Papad", "Lime juice"] }
          ]
        },
        dinner: {
          name: "Dinner",
          startTime: "18:30",
          endTime: "21:15",
          items: [],
          sections: [
            { kind: "specialVeg", title: "Special Veg", items: ["Aloo Paratha"] },
            { kind: "veg", title: "Veg", items: ["Sattu Paratha", "Chapathi", "Mix Sabzi", "Dal", "Rice"] }
          ]
        }
      }
    }
  },
  extras: {
    category: "Extras",
    currency: "INR",
    items: [
      { name: "Butter Milk", price: 10 },
      { name: "Dahi", price: 10 },
      { name: "Fruit Juice", price: 50 },
      { name: "Lassi", price: 35 },
      { name: "Boiled Eggs", price: 10 },
      { name: "Lime", price: 25 }
    ]
  }
};

function getWeekInfo(date: Date): { weekId: string; weekLabel: string } {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(daysSinceStart / 7) + 1;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (d: Date) => {
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day.toString().padStart(2, '0')}`;
  };

  const weekId = `${formatDate(weekStart)}_to_${formatDate(weekEnd)}`;
  const weekLabel = `${formatDate(weekStart)} – ${formatDate(weekEnd)} • Fixed weekly menu`;

  return { weekId, weekLabel };
}
