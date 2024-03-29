import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = "location-tracking";
export const STORAGE_CURRENT_LOCATION_KEY = 'expo-current-location';
export const INTERVAL = 15000;
export const LATITUDE_DELTA = 0.004;
export const LONGITUDE_DELTA = 0.004;


export async function getSavedCurrentLocation() {
    try {
        const item = await AsyncStorage.getItem(STORAGE_CURRENT_LOCATION_KEY);
        return item ? JSON.parse(item) : {};
    } catch (e) {
        return [];
    }
}

export 
async function saveCurrentLocation(locations: any[]) {
    try {
        await AsyncStorage.setItem(STORAGE_CURRENT_LOCATION_KEY, JSON.stringify({
            latitude: locations[0].coords.latitude,
            longitude: locations[0].coords.longitude,
        }));
    } catch (e) {
        return {};
    }
}


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    try {
        if (error) {
            // Error occurred - check `error.message` for more details.
            console.log('errors: ', error);
            return;
        }
        if (data) {
            const { locations }: any = data;
            // console.log('updated location in ', new Date().toLocaleTimeString(), locations)
            saveCurrentLocation(locations)
            
        } else {
            saveCurrentLocation([{ latitude: 31.945368, longitude: 35.928371 }])
        }
    } catch (error) {
        console.log('catched error: ', error);
    }
});

export const requestPermissions = async () => {
    try {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status === "granted") {
            console.log('granted');
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                showsBackgroundLocationIndicator: true,
                accuracy: Location.Accuracy.BestForNavigation,
                foregroundService: {
                    notificationTitle: LOCATION_TASK_NAME,
                    notificationBody: 'Background location is running...',
                    notificationColor: 'blue',
                },
                mayShowUserSettingsDialog: true,
                activityType: Location.LocationActivityType.AutomotiveNavigation,
            });
       
        } else {
            console.log('not granted');
            
        }
        // const response = await Location.requestBackgroundPermissionsAsync();
        // console.log('response: ', response);
        

    } catch (error) {
        console.log('catched error require permissions: ', error);
    }
};
