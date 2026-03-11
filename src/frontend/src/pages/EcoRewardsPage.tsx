import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Award,
  Camera,
  ChevronRight,
  Leaf,
  MapPin,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useEcoPoints,
  useMyTrashReports,
  useSubmitTrashReport,
} from "../hooks/useQueries";
import { formatDate, getTrashStatusColor } from "../lib/format";

const HOW_TO_EARN = [
  {
    icon: Award,
    title: "Purchase Products",
    pts: "+10 pts",
    desc: "Earn 10 eco points for every purchase you make.",
  },
  {
    icon: Camera,
    title: "Upload Trash Photos",
    pts: "+50 pts",
    desc: "Photograph litter and submit for verification to earn bonus points.",
  },
  {
    icon: Leaf,
    title: "Refer Friends",
    pts: "+25 pts",
    desc: "Invite friends to join. Earn 25 points when they make their first order.",
  },
];

export function EcoRewardsPage() {
  const { identity, login } = useInternetIdentity();
  const { data: ecoPoints } = useEcoPoints();
  const { data: trashReports } = useMyTrashReports();
  const { mutate: submitReport, isPending } = useSubmitTrashReport();

  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    submitReport(
      { imageUrl, location },
      {
        onSuccess: () => {
          toast.success(
            "Trash report submitted! Await verification for your eco points.",
          );
          setImageUrl("");
          setLocation("");
        },
        onError: () => toast.error("Failed to submit report"),
      },
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Leaf className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h1 className="font-display text-4xl font-bold mb-3">
              Eco Rewards Program
            </h1>
            <p className="opacity-80 max-w-xl mx-auto text-lg">
              Earn points for every eco action you take. Shop sustainably, clean
              up Nepal, and get rewarded!
            </p>
            {identity && (
              <div className="mt-8 inline-block bg-white/10 rounded-2xl px-8 py-4">
                <p className="text-sm opacity-70 uppercase tracking-wide">
                  Your Balance
                </p>
                <p className="font-display text-5xl font-bold">
                  {ecoPoints?.toString() ?? "0"}
                </p>
                <p className="text-sm opacity-70">Eco Points</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* How to Earn */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-primary mb-2 text-center">
            How to Earn Points
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Simple actions, real rewards
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_TO_EARN.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <Badge className="mb-3 bg-accent text-accent-foreground">
                  {item.pts}
                </Badge>
                <h3 className="font-heading font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trash Upload */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-primary mb-2 text-center">
            Submit Trash Report
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Upload a photo of litter you've spotted or cleaned. Earn eco points
            for verified reports!
          </p>

          {!identity ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Please login to submit a trash report
              </p>
              <Button
                onClick={() => login()}
                className="bg-primary text-primary-foreground"
              >
                Login to Submit
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitReport}
              className="bg-card rounded-xl p-6 shadow-card space-y-4"
            >
              <div>
                <Label
                  htmlFor="imageUrl"
                  className="flex items-center gap-2 mb-1"
                >
                  <Camera className="h-4 w-4" /> Photo URL
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/my-trash-photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  data-ocid="eco.upload_button"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your photo to a service (e.g. Google Photos) and paste
                  the link here.
                </p>
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="flex items-center gap-2 mb-1"
                >
                  <MapPin className="h-4 w-4" /> Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Pashupatinath Temple, Kathmandu"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground"
                data-ocid="eco.primary_button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* My Reports */}
      {identity && trashReports && trashReports.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">
              My Trash Reports
            </h2>
            <div className="space-y-3">
              {trashReports.map((report, i) => (
                <div
                  key={report.id.toString()}
                  data-ocid={`eco.item.${i + 1}`}
                  className="bg-card rounded-xl p-4 shadow-xs flex items-center gap-4"
                >
                  <img
                    src={report.imageUrl}
                    alt="Trash report"
                    className="w-16 h-16 rounded-lg object-cover bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getTrashStatusColor(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
