import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { Calendar, Footprints, Flame, Timer, ChevronDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTimeframe, setActiveTimeframe] = useState('Week');
  const [selectedStat, setSelectedStat] = useState('Steps');
  
  // Sample data
  const timeframes = ['Day', 'Week', 'Month', 'Year'];
  const stats = ['Steps', 'Calories', 'Active Time'];
  
  // Steps data
  const stepsData = [
    { value: 6542, label: 'Mon', frontColor: theme.colors.primary[500] },
    { value: 7854, label: 'Tue', frontColor: theme.colors.primary[500] },
    { value: 9421, label: 'Wed', frontColor: theme.colors.primary[600] },
    { value: 8245, label: 'Thu', frontColor: theme.colors.primary[500] },
    { value: 7856, label: 'Fri', frontColor: theme.colors.primary[500] },
    { value: 4521, label: 'Sat', frontColor: theme.colors.primary[400] },
    { value: 3652, label: 'Sun', frontColor: theme.colors.primary[400] },
  ];
  
  // Calories data
  const caloriesData = [
    { value: 320, label: 'Mon', frontColor: theme.colors.error[500] },
    { value: 480, label: 'Tue', frontColor: theme.colors.error[500] },
    { value: 520, label: 'Wed', frontColor: theme.colors.error[600] },
    { value: 390, label: 'Thu', frontColor: theme.colors.error[500] },
    { value: 450, label: 'Fri', frontColor: theme.colors.error[500] },
    { value: 280, label: 'Sat', frontColor: theme.colors.error[400] },
    { value: 190, label: 'Sun', frontColor: theme.colors.error[400] },
  ];
  
  // Active time data
  const activeTimeData = [
    { value: 35, label: 'Mon', frontColor: theme.colors.success[500] },
    { value: 55, label: 'Tue', frontColor: theme.colors.success[500] },
    { value: 65, label: 'Wed', frontColor: theme.colors.success[600] },
    { value: 45, label: 'Thu', frontColor: theme.colors.success[500] },
    { value: 50, label: 'Fri', frontColor: theme.colors.success[500] },
    { value: 30, label: 'Sat', frontColor: theme.colors.success[400] },
    { value: 20, label: 'Sun', frontColor: theme.colors.success[400] },
  ];
  
  // Line chart data
  const lineData = [
    { value: 6542, date: 'Apr 9' },
    { value: 7854, date: 'Apr 10' },
    { value: 9421, date: 'Apr 11' },
    { value: 8245, date: 'Apr 12' },
    { value: 7856, date: 'Apr 13' },
    { value: 4521, date: 'Apr 14' },
    { value: 3652, date: 'Apr 15' },
  ];
  
  // Get active data based on selected stat
  const getActiveData = () => {
    switch (selectedStat) {
      case 'Steps':
        return stepsData;
      case 'Calories':
        return caloriesData;
      case 'Active Time':
        return activeTimeData;
      default:
        return stepsData;
    }
  };
  
  // Get color based on selected stat
  const getColor = () => {
    switch (selectedStat) {
      case 'Steps':
        return theme.colors.primary[600];
      case 'Calories':
        return theme.colors.error[600];
      case 'Active Time':
        return theme.colors.success[600];
      default:
        return theme.colors.primary[600];
    }
  };
  
  // Get unit based on selected stat
  const getUnit = () => {
    switch (selectedStat) {
      case 'Steps':
        return 'steps';
      case 'Calories':
        return 'cal';
      case 'Active Time':
        return 'min';
      default:
        return '';
    }
  };
  
  // Get icon based on selected stat
  const getIcon = () => {
    switch (selectedStat) {
      case 'Steps':
        return <Footprints size={20} color={theme.colors.primary[600]} />;
      case 'Calories':
        return <Flame size={20} color={theme.colors.error[600]} />;
      case 'Active Time':
        return <Timer size={20} color={theme.colors.success[600]} />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Calendar size={20} color={theme.colors.neutral[700]} />
          <Text style={styles.dateText}>April 9 - April 15, 2025</Text>
          <ChevronDown size={18} color={theme.colors.neutral[700]} />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.timeframesContainer}
        >
          {timeframes.map((timeframe, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeframeButton,
                activeTimeframe === timeframe && styles.activeTimeframeButton
              ]}
              onPress={() => setActiveTimeframe(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  activeTimeframe === timeframe && styles.activeTimeframeText
                ]}
              >
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Weekly Overview</Text>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.barChartContainer}>
              <BarChart
                data={getActiveData()}
                width={300}
                height={200}
                barWidth={32}
                spacing={20}
                barBorderRadius={4}
                frontColor={getColor()}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={theme.colors.neutral[300]}
                yAxisTextStyle={{ color: theme.colors.neutral[500], fontFamily: theme.fonts.body.regular }}
                xAxisLabelTextStyle={{ color: theme.colors.neutral[500], fontFamily: theme.fonts.body.regular }}
                noOfSections={5}
                hideYAxisText
                yAxisLabelWidth={0}
                initialSpacing={10}
                isAnimated
              />
            </View>
          </ScrollView>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsButtons}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.statButton,
                selectedStat === stat && { borderColor: getColor() }
              ]}
              onPress={() => setSelectedStat(stat)}
            >
              {selectedStat === stat && (
                <View style={[styles.activeStatDot, { backgroundColor: getColor() }]} />
              )}
              <Text
                style={[
                  styles.statButtonText,
                  selectedStat === stat && { color: getColor() }
                ]}
              >
                {stat}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.detailedCard}>
          <View style={styles.detailedHeader}>
            <View style={styles.detailedTitleContainer}>
              {getIcon()}
              <Text style={styles.detailedTitle}>{selectedStat} Trend</Text>
            </View>
            
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          <LineChart
            data={lineData.map(item => ({ value: item.value }))}
            width={300}
            height={200}
            spacing={40}
            initialSpacing={20}
            color1={getColor()}
            color2={`${getColor()}33`}
            textColor1="black"
            dataPointsColor1={getColor()}
            dataPointsColor2={getColor()}
            startFillColor1={getColor()}
            startFillColor2={`${getColor()}33`}
            endFillColor1={`${getColor()}00`}
            endFillColor2={`${getColor()}00`}
            startOpacity={0.9}
            endOpacity={0.2}
            noOfSections={5}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={theme.colors.neutral[300]}
            hideRules
            hideYAxisText
            yAxisLabelWidth={0}
            isAnimated
            showGradient
            areaChart
          />
          
          <View style={styles.statsLabels}>
            <View style={styles.statsLabel}>
              <Text style={styles.statsLabelTitle}>Avg. {selectedStat}</Text>
              <Text style={styles.statsLabelValue}>
                {selectedStat === 'Steps' ? '6,870' : selectedStat === 'Calories' ? '376' : '43'}
                <Text style={styles.statsLabelUnit}> {getUnit()}</Text>
              </Text>
            </View>
            
            <View style={styles.statsLabel}>
              <Text style={styles.statsLabelTitle}>Highest</Text>
              <Text style={styles.statsLabelValue}>
                {selectedStat === 'Steps' ? '9,421' : selectedStat === 'Calories' ? '520' : '65'}
                <Text style={styles.statsLabelUnit}> {getUnit()}</Text>
              </Text>
            </View>
            
            <View style={styles.statsLabel}>
              <Text style={styles.statsLabelTitle}>Total</Text>
              <Text style={styles.statsLabelValue}>
                {selectedStat === 'Steps' ? '48,091' : selectedStat === 'Calories' ? '2,630' : '300'}
                <Text style={styles.statsLabelUnit}> {getUnit()}</Text>
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[500],
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginHorizontal: theme.spacing.sm,
  },
  timeframesContainer: {
    marginBottom: theme.spacing.md,
  },
  timeframeButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[200],
    marginRight: theme.spacing.sm,
  },
  activeTimeframeButton: {
    backgroundColor: theme.colors.primary[600],
  },
  timeframeText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
  },
  activeTimeframeText: {
    color: '#fff',
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  overviewTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  detailsButton: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
  },
  detailsText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[700],
  },
  barChartContainer: {
    paddingBottom: theme.spacing.sm,
  },
  statsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    marginHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
  },
  activeStatDot: {
    position: 'absolute',
    top: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statButtonText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
  },
  detailedCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  detailedTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailedTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  exportButton: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
  },
  exportText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[700],
  },
  statsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  statsLabel: {
    alignItems: 'center',
  },
  statsLabelTitle: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[500],
    marginBottom: 2,
  },
  statsLabelValue: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  statsLabelUnit: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[500],
  },
  bottomPadding: {
    height: 100,
  },
});