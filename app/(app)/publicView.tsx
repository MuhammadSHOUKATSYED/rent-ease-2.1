import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import { Image } from "@/components/image";

export default function PublicView() {
  const { user } = useSupabase();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name, phone, address, profilePicture")
          .eq("id", user.id)
          .single();

        if (error) {
          Alert.alert("Error fetching profile", error.message);
        } else {
          setProfile({
            name: data?.name || "No name",
            phone: data?.phone || "No phone number",
            address: data?.address || "No address",
            profilePicture: data?.profilePicture || "",
          });
        }
      }
    };
    fetchProfile();
  }, [user?.id]);

  return (
    <View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
      {/* Display Profile Picture */}
      {profile.profilePicture ? (
        <Image
          source={{ uri: profile.profilePicture }}
          className="w-40 h-40 rounded-full mb-4"
        />
      ) : (
        <Image
          source={require("@/assets/Logo.png")}
          className="w-40 h-40 rounded-full mb-4"
        />
      )}

      {/* Display User's Name */}
      <H1 className="text-center">{profile.name}</H1>
      <Muted className="text-center">Address: {profile.address}</Muted>
	  <Muted className="text-center">Phone: {profile.phone}</Muted>

    </View>
  );
}
