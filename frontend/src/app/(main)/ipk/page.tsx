"use client";
import { useEffect, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIPKData, updateIPKEntry } from "@/lib/api/ipk";
import { calculateIP, calculateIPK, getTotalSKS } from "@/lib/utils/ipk-calculator";
import { GRADE_OPTIONS } from "@/lib/constants/grade-map";
import type { IPKCawu, Grade } from "@/types";

export default function IPKPage() {
  const [ipkData, setIpkData] = useState<IPKCawu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIPKData()
      .then(setIpkData)
      .finally(() => setLoading(false));
  }, []);

  const handleGradeChange = async (
    cawu: number,
    courseId: number,
    grade: string
  ) => {
    const updated = await updateIPKEntry(
      cawu,
      courseId,
      grade === "none" ? null : grade
    );
    setIpkData(updated);
  };

  if (loading) {
    return <IPKSkeleton />;
  }

  const overallIPK = calculateIPK(ipkData);
  const totalSKSAll = ipkData.reduce(
    (sum, cawu) => sum + getTotalSKS(cawu.entries),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Kalkulator IPK
          </h1>
          <p className="text-muted-foreground">
            Hitung dan pantau performa akademik Anda
          </p>
        </div>

        {/* Summary card */}
        <Card className="w-auto">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              IPK Kumulatif
            </p>
            <p className="text-4xl font-bold text-primary mt-1">
              {overallIPK.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalSKSAll} SKS total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="1">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="1">Cawu 1</TabsTrigger>
          <TabsTrigger value="2">Cawu 2</TabsTrigger>
          <TabsTrigger value="3">Cawu 3</TabsTrigger>
          <TabsTrigger value="4">Cawu 4</TabsTrigger>
          <TabsTrigger value="5">Cawu 5</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {ipkData.map((cawuData) => (
          <TabsContent key={cawuData.cawu} value={String(cawuData.cawu)}>
            <CawuTab
              cawuData={cawuData}
              onGradeChange={handleGradeChange}
            />
          </TabsContent>
        ))}

        <TabsContent value="summary">
          <SummaryTab ipkData={ipkData} overallIPK={overallIPK} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CawuTab({
  cawuData,
  onGradeChange,
}: {
  cawuData: IPKCawu;
  onGradeChange: (cawu: number, courseId: number, grade: string) => void;
}) {
  const ip = calculateIP(cawuData.entries);
  const totalSKS = getTotalSKS(cawuData.entries);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Cawu {cawuData.cawu}</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">IP: </span>
              <span className="font-bold text-primary">{ip.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">SKS: </span>
              <span className="font-semibold">{totalSKS}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cawuData.entries.map((entry) => (
            <div
              key={entry.course_id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium">{entry.course_name}</p>
                <p className="text-sm text-muted-foreground">{entry.sks} SKS</p>
              </div>
              <Select
                value={entry.grade || "none"}
                onValueChange={(val) =>
                  onGradeChange(cawuData.cawu, entry.course_id, val)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Nilai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryTab({
  ipkData,
  overallIPK,
}: {
  ipkData: IPKCawu[];
  overallIPK: number;
}) {
  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">IPK Kumulatif</p>
            <p className="text-4xl font-bold text-primary mt-2">
              {overallIPK.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total SKS</p>
            <p className="text-4xl font-bold mt-2">
              {ipkData.reduce((sum, c) => sum + getTotalSKS(c.entries), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Rata-rata IP</p>
            <p className="text-4xl font-bold mt-2">
              {(
                ipkData
                  .filter((c) => getTotalSKS(c.entries) > 0)
                  .reduce((sum, c) => sum + calculateIP(c.entries), 0) /
                ipkData.filter((c) => getTotalSKS(c.entries) > 0).length || 0
              ).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Per cawu breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performa per Cawu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ipkData.map((cawu) => {
              const ip = calculateIP(cawu.entries);
              const sks = getTotalSKS(cawu.entries);
              return (
                <div
                  key={cawu.cawu}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {cawu.cawu}
                    </div>
                    <div>
                      <p className="font-medium">Cawu {cawu.cawu}</p>
                      <p className="text-sm text-muted-foreground">
                        {sks} SKS
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {ip.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">IP</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Simple trend visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trend IP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-32">
            {ipkData.map((cawu) => {
              const ip = calculateIP(cawu.entries);
              const height = ip > 0 ? (ip / 4) * 100 : 0;
              return (
                <div
                  key={cawu.cawu}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium">C{cawu.cawu}</p>
                    <p className="text-xs text-muted-foreground">
                      {ip.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IPKSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-24 w-32" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Card>
        <CardContent className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
