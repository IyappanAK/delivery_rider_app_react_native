import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'

export default function BottomButton(props:any) {
const {nav,title,orderTotal}=props
  return (
    <View style={styles.footer}>
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
      <Link href={{ pathname: nav, params: { orderTotal} }} asChild>
        <TouchableOpacity style={styles.fullButton}>
          <Text style={styles.footerText}>{title}</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  </View>
  )
}


const styles = StyleSheet.create({
    detailsContainer: {
      backgroundColor: Colors.lightGrey,
    },
    stickySection: {
      backgroundColor: '#fff',
      marginLeft: 70,
      height: 100,
      justifyContent: 'flex-end',
    },
    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    stickySectionText: {
      fontSize: 20,
      marginVertical: 10,
    },
    restaurantName: {
      fontSize: 30,
      margin: 16,
    },
    restaurantDescription: {
      fontSize: 16,
      margin: 16,
      lineHeight: 22,
      color: Colors.medium,
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 16,
      margin: 16,
    },
    item: {
      backgroundColor: '#fff',
      padding: 16,
      flexDirection: 'row',
    },
    dishImage: {
      height: 80,
      width: 80,
      borderRadius: 4,
    },
    dish: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    dishText: {
      fontSize: 14,
      color: Colors.mediumDark,
      paddingVertical: 4,
    },
    stickySegments: {
      position: 'absolute',
      height: 50,
      left: 0,
      right: 0,
      top: 100,
      backgroundColor: '#fff',
      overflow: 'hidden',
      paddingBottom: 4,
    },
    segmentsShadow: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      width: '100%',
      height: '100%',
    },
    segmentButton: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 50,
    },
    segmentText: {
      color: Colors.primary,
      fontSize: 16,
    },
    segmentButtonActive: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 50,
    },
    segmentTextActive: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    segmentScrollview: {
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 20,
      paddingBottom: 4,
    },
    footer: {
      position: 'absolute',
      backgroundColor: '#fff',
      bottom: 0,
      left: 0,
      width: '100%',
      padding: 15,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      paddingTop: 15,
    },
    fullButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      height: 50,
    },
    footerText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    basket: {
      color: '#fff',
      backgroundColor: '#19AA86',
      fontWeight: 'bold',
      padding: 8,
      borderRadius: 2,
    },
    basketTotal: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });