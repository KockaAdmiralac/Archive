import json
from operator import itemgetter
from typing import Dict, List, Set

bboxes_path = input()
joints_path = input()
box_frames: Dict[int, Dict[str, Dict]] = {}
joint_frames: Dict[int, Dict[str, Dict]] = {}
box_identities: Set[str] = set()
joint_identities: Set[str] = set()
closest_frame_left: List[int] = []
closest_frame_right: List[int] = []
with open(bboxes_path) as boxes_file:
    for frame in json.load(boxes_file)['frames']:
        boxes = {}
        for box in frame['bounding_boxes']:
            boxes[box['identity']] = box['bounding_box']
        box_frames[frame['frame_index']] = boxes
with open(joints_path) as joints_file:
    for frame in json.load(joints_file)['frames']:
        joints = {}
        for joint in frame['joints']:
            joints[joint['identity']] = joint['joint']
        joint_frames[frame['frame_index']] = joints

for frame in box_frames.values():
    for box in frame.keys():
        box_identities.add(box)

for frame in joint_frames.values():
    for joint in frame.keys():
        joint_identities.add(joint)

last_joint_frame = max(joint_frames.keys())
last_box_frame = max(box_frames.keys())
last_frame = last_joint_frame if last_joint_frame > last_box_frame else last_box_frame

closest = -1
for i in range(last_frame + 1):
    if i in joint_frames:
        closest = i
    closest_frame_left.append(closest)
closest = -1
for i in range(last_frame, -1, -1):
    if i in joint_frames:
        closest = i
    closest_frame_right.append(closest)
closest_frame_right.reverse()

def get_joints(current_frame, left_frame, right_frame):
    joints = {}
    left_joints = joint_frames[left_frame]
    right_joints = joint_frames[right_frame]
    for joint in joint_identities:
        if not (joint in joint_frames[left_frame] and joint in joint_frames[right_frame]):
            continue
        k = (current_frame - left_frame) / (right_frame - left_frame)
        x = left_joints[joint]['x'] + (right_joints[joint]['x'] - left_joints[joint]['x']) * k
        y = left_joints[joint]['y'] + (right_joints[joint]['y'] - left_joints[joint]['y']) * k
        joints[joint] = {
            'x': x,
            'y': y
        }
    return joints

matches: Dict[str, Dict[str, int]] = {}
reverse_matches: Dict[str, Dict[str, int]] = {}
for i in sorted(box_frames.keys()):
    joints = {}
    if i in joint_frames:
        joints = joint_frames[i]
    elif closest_frame_left[i] == -1 and closest_frame_left[i] == -1:
        continue
    elif closest_frame_left[i] == -1:
        if closest_frame_right[closest_frame_right[i] + 1] == -1:
            continue
        else:
            joints = get_joints(i, closest_frame_right[i], closest_frame_right[closest_frame_right[i] + 1])
    elif closest_frame_right[i] == -1:
        if closest_frame_left[closest_frame_left[i] - 1] == -1:
            continue
        else:
            joints = get_joints(i, closest_frame_left[closest_frame_left[i] - 1], closest_frame_left[i])
    else:
        joints = get_joints(i, closest_frame_left[i], closest_frame_right[i])
    for joint_identity, joint in joints.items():
        min_diff = 10000000
        found = "-1"
        for box_identity, box in box_frames[i].items():
            # We expect the joint to be in the box
            if joint['x'] < box['x'] or joint['x'] > (box['x'] + box['w']) or joint['y'] < box['y'] or joint['y'] > (box['y'] + box['h']):
                continue
            # We expect the joint to be in the upper part of the bounding box
            if (joint['y'] - box['y']) / box['h'] > 0.5:
                continue
            # We expect the joint to be close to the middle of the bounding box
            diff = box['x'] + box['w'] / 2 - joint['x']
            if diff < min_diff:
                found = box_identity
                min_diff = diff
        if found != "-1":
            if joint_identity not in matches:
                matches[joint_identity] = {}
            if found not in reverse_matches:
                reverse_matches[found] = {}
            if found not in matches[joint_identity]:
                matches[joint_identity][found] = 0
            if joint_identity not in reverse_matches[found]:
                reverse_matches[found][joint_identity] = 0
            matches[joint_identity][found] += 1
            reverse_matches[found][joint_identity] += 1

print(matches)
print(reverse_matches)

for box_identity, box_matches in reverse_matches.items():
    if len(box_matches) == 0:
        continue
    max_percentage = 0
    max_identity = ""
    for joint_identity, joint_matches in box_matches.items():
        percentage = joint_matches / sum(matches[joint_identity].values())
        if percentage > max_percentage:
            max_percentage = percentage
            max_identity = joint_identity
    for joint_identity, joint_matches in box_matches.items():
        if joint_identity != max_identity:
            del matches[joint_identity][box_identity]

for joint_identity, joint_matches in matches.items():
    if len(joint_matches) > 0:
        print(f'{joint_identity}:{max(joint_matches.items(), key=itemgetter(1))[0]}')
